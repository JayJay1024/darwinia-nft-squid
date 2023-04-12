import {lookupArchive} from "@subsquid/archive-registry"
import {BatchContext, BatchProcessorItem, SubstrateBatchProcessor} from "@subsquid/substrate-processor"
import {Store, TypeormDatabase} from "@subsquid/typeorm-store"
import {ClaimRemark} from "./model"
import {SystemRemarkCall} from "./types/calls"


const processor = new SubstrateBatchProcessor()
    .setBlockRange({ from: 9424555 })
    .setDataSource({
        // Lookup archive by the network name in the Subsquid registry
        //archive: lookupArchive("kusama", {release: "FireSquid"})

        // Use archive created by archive/docker-compose.yml
        archive: lookupArchive('polkadot', {release: 'FireSquid'} )
    })
    .addCall('System.remark', {
        data: {
            call: {
                args: true,
            },
            extrinsic: {
                signature: true,
                success: true,  // fetch the extrinsic success status
                hash: true,
                indexInBlock: true,
            }
        }
    } as const)


type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>


processor.run(new TypeormDatabase(), async ctx => {
    let remarksData = getRemarks(ctx)
    let remarks: ClaimRemark[] = []
    for (let r of remarksData) {
        let {id, signer, value, addressValue, blockNumber, extrinsicIndex, extrinsicHash, extrinsicTimestamp} = r;
        remarks.push(new ClaimRemark({
            id,
            signer,
            value,
            addressValue,
            blockNumber,
            extrinsicIndex,
            extrinsicHash,
            extrinsicTimestamp
        }));
    }
    await ctx.store.insert(remarks)
})

interface RemarkCall {
    id: string
    signer: string
    value: string
    addressValue: string
    blockNumber: number
    extrinsicIndex: number
    extrinsicHash: string
    extrinsicTimestamp: Date
}

function getRemarks(ctx: Ctx):RemarkCall[] {
    let prefix = "NFT amount: 1; Rewards receiving address: 0x";
    let remarks: RemarkCall[] = []
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.name === 'System.remark' && item.call.success) {
                let c = new SystemRemarkCall(ctx, item.call)
                if (c.isV1020) {
                    if (c.asV1020.remark.toString().startsWith(prefix) && item.extrinsic.signature?.address.__kind === 'Id') {
                        let value = c.asV1020.remark.toString()
                        remarks.push({
                            id: item.call.id,
                            signer: item.extrinsic.signature?.address.value,
                            value,
                            addressValue: value.slice(prefix.length - 2),
                            blockNumber: block.header.height,
                            extrinsicIndex: item.extrinsic.indexInBlock,
                            extrinsicHash: item.extrinsic.hash,
                            extrinsicTimestamp: new Date(block.header.timestamp),
                        })
                    }
                } else {
                    throw new Error('Unsupported spec')
                }
            }
        }
    }
    return remarks;
}
