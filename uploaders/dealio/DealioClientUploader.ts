import {BaseUploader} from "../../common/types/BaseUploader";
import {DestinationType} from "../../common/enums/DestinationType";
import {DealioClient} from "../../transformers/dealio/messages/DealioClient";
import { DbService } from "../../common/services/DbService";

export class DealioClientUploader extends BaseUploader<DestinationType.DealioReplica,DealioClient> {

    constructor(){
        super(DestinationType.DealioReplica)
    }
    async upload(db: DbService, msg: DealioClient): Promise<boolean> {
        await db.query(this.getSql(),[
            msg.member_id,
            msg.client_id,
            msg.affiliate_id,
            msg.campaign_id,
            msg.country,
            msg.sales_agent_id,
            msg.registration_date,
            msg.last_login_date,
            msg.last_active_date,
            msg.created_at,
            msg.updated_at,
            msg.trading_status,
            msg.kyc_status,
            msg.converted_at,
            msg.client_type,
            msg.company,
            msg.white_label,
            msg.kyc_rejection_reason_code,
            msg.last_update_time
        ])
        return true;
    }

    getSql(): string {
        return `insert into data.members
                        (member_id,
                        client_id,
                        affiliate_id,
                        campaign_id,
                        country,
                        sales_agent_id,
                        registration_date,
                        last_login_date,
                        last_active_date,
                        created_at,
                        updated_at,
                        trading_status,
                        kyc_status,
                        converted_at,
                        client_type,
                        company,
                        white_label,
                        kyc_rejection_reason_code,
                        last_update_time)
                values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
                ON CONFLICT(member_id) DO
                UPDATE
                SET member_id=(CASE
                        WHEN data.members.last_update_time>=
                            EXCLUDED.last_update_time ::timestamp without time zone  then data.members.member_id
                        ELSE
                        EXCLUDED.member_id
                        END),
                client_id=(CASE
                        WHEN data.members.last_update_time >=
                            EXCLUDED.last_update_time ::timestamp without time zone THEN data.members.client_id
                        ELSE
                        EXCLUDED.client_id
                        END),
                affiliate_id=(CASE
                        WHEN data.members.last_update_time >=
                            EXCLUDED.last_update_time ::timestamp without time zone THEN data.members.affiliate_id
                        ELSE
                            EXCLUDED.affiliate_id
                        END),
                campaign_id=(CASE
                        WHEN data.members.last_update_time >=
                            EXCLUDED.last_update_time ::timestamp without time zone THEN data.members.campaign_id
                        ELSE
                            EXCLUDED.campaign_id
                        END),
                country=(CASE
                        WHEN data.members.last_update_time>=
                            EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.country
                        ELSE
                            EXCLUDED.country
                        END),
                sales_agent_id=(CASE
                        WHEN data.members.last_update_time>=
                            EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.sales_agent_id
                        ELSE
                            EXCLUDED.sales_agent_id
                        END),
                registration_date=(CASE
                        WHEN data.members.last_update_time>=
                        EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.registration_date
                        ELSE
                        EXCLUDED.registration_date
                        END),
                last_login_date=(CASE
                        WHEN data.members.last_update_time>=
                        EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.last_login_date
                        ELSE
                        EXCLUDED.last_login_date
                        END),
                last_active_date=(CASE
                        WHEN data.members.last_update_time>=
                        EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.last_active_date
                        ELSE
                        EXCLUDED.last_active_date
                        END),
                created_at=(CASE
                        WHEN data.members.last_update_time>=
                        EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.created_at
                        ELSE
                        EXCLUDED.created_at
                        END),
                updated_at=(CASE
                        WHEN data.members.last_update_time>=
                        EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.updated_at
                        ELSE
                        EXCLUDED.updated_at
                        END),
                trading_status=(CASE
                        WHEN data.members.last_update_time>=
                        EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.trading_status
                        ELSE
                        EXCLUDED.trading_status
                        END),
                kyc_status=(CASE
                        WHEN data.members.last_update_time>=
                        EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.kyc_status
                        ELSE
                        EXCLUDED.kyc_status
                        END),
                converted_at=(CASE
                        WHEN data.members.last_update_time>=
                        EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.converted_at
                        ELSE
                        EXCLUDED.converted_at
                        END),
                client_type=(CASE
                        WHEN data.members.last_update_time>=
                        EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.client_type
                        ELSE
                        EXCLUDED.client_type
                        END),
                company=(CASE
                        WHEN data.members.last_update_time>=
                        EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.company
                        ELSE
                        EXCLUDED.company
                        END),
                white_label=(CASE
                        WHEN data.members.last_update_time>=
                        EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.white_label
                        ELSE
                        EXCLUDED.white_label
                        END),
                kyc_rejection_reason_code=(CASE
                    WHEN data.members.last_update_time>=
                    EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.kyc_rejection_reason_code
                    ELSE
                    EXCLUDED.kyc_rejection_reason_code
                    END),
                last_update_time=(CASE
                    WHEN data.members.last_update_time>=
                        EXCLUDED.last_update_time ::timestamp without time zone  THEN data.members.last_update_time
                    ELSE
                        EXCLUDED.last_update_time ::timestamp without time zone
                    END)`
    }
}
