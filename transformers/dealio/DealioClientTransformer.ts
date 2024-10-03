import {BaseTransformer} from "../../common/types/BaseTransformer";
import {DealioClient} from "./messages/DealioClient";
import {Client} from "../../extractors/backend/clients/messages/Client";

export class DealioClientTransformer extends BaseTransformer<Client, DealioClient> {
    async transform(input: Client): Promise<DealioClient> {
        const client: DealioClient = {
            member_id: input.member_id,
            created_at: input.created_at,
            client_id: input.member_id,
            affiliate_id: input.additional_attributes?.affiliate_id ?? null,
            campaign_id: input.additional_attributes?.campaign_id ?? null,
            country: input.profile_information?.country ?? null,
            sales_agent_id: input.additional_attributes?.sales_agent_id ?? null,
            registration_date: input.registration_date,
            last_login_date: input.last_login_date,
            last_active_date: input.last_active_date,
            updated_at: input.updated_at,
            trading_status: input.additional_attributes?.trading_status ?? null,
            kyc_status: input.kyc_status,
            converted_at: input.converted_at,
            client_type: input.additional_attributes?.client_type ?? null,
            company: input.additional_attributes?.company ?? null,
            white_label: input.additional_attributes?.white_label ?? null,
            kyc_rejection_reason_code: input.kyc_rejection_reason_code,
            last_update_time: input.updated_at
        }
        return client
    }
}
