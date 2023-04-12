module.exports = class Data1681293375328 {
    name = 'Data1681293375328'

    async up(db) {
        await db.query(`CREATE TABLE "claim_remark" ("id" character varying NOT NULL, "signer" text NOT NULL, "value" text NOT NULL, "address_value" text NOT NULL, "block_number" integer NOT NULL, "extrinsic_index" integer NOT NULL, "extrinsic_hash" text NOT NULL, "extrinsic_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_a7378d6ff513ac0b3d864b1d994" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b545ff2006f982c55d70e27aea" ON "claim_remark" ("signer") `)
        await db.query(`CREATE INDEX "IDX_6e581bb400796dd9cf5b6bb69c" ON "claim_remark" ("block_number") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "claim_remark"`)
        await db.query(`DROP INDEX "public"."IDX_b545ff2006f982c55d70e27aea"`)
        await db.query(`DROP INDEX "public"."IDX_6e581bb400796dd9cf5b6bb69c"`)
    }
}
