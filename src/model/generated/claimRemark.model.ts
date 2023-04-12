import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class ClaimRemark {
    constructor(props?: Partial<ClaimRemark>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    signer!: string

    @Column_("text", {nullable: false})
    value!: string

    @Column_("text", {nullable: false})
    addressValue!: string

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Column_("int4", {nullable: false})
    extrinsicIndex!: number

    @Column_("text", {nullable: false})
    extrinsicHash!: string

    @Column_("timestamp with time zone", {nullable: false})
    extrinsicTimestamp!: Date
}
