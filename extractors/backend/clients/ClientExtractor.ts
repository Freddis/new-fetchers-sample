import {BaseExtractor} from "../../../common/types/BaseExtractor";
import {Client, ClientValidator, clientValidator} from "./messages/Client";
import {SourceType} from "../../../common/enums/SourceType";

export class ClientExtractor extends BaseExtractor<SourceType.BACKEND_DB, ClientValidator> {
    protected override getCursorFieldValueSql(): string {
        return 'id'
    }
    protected override getTimestampFieldValueSql(): string {
        return "(extract(epoch from (updated_at AT TIME ZONE 'UTC')))::integer"
    }
    protected override getTimeStampFieldAlias(): keyof Client {
        return 'update_epoch'
    }
    
    protected override getCursorFieldAlias(): keyof Client { 
        return 'member_id'
    }

    override getValidator(): ClientValidator {
        return clientValidator
    }

    protected getQuery() : string {
   
        const sql = `select
                        id as member_id,
                        id as unique_id,
                        'member' as record_type,
                        COALESCE(email,'N/A') as email,
                        COALESCE(full_name,'N/A') as full_name,
                        COALESCE((registration_date at time zone 'UTC')::timestamp without time zone,'1970-01-01 00:00:00'::timestamp without time zone) as registration_date,
                        COALESCE((last_login_date at time zone 'UTC')::timestamp without time zone,'1970-01-01 00:00:00'::timestamp without time zone) as last_login_date,
                        COALESCE((last_active_date at time zone 'UTC')::timestamp without time zone,'1970-01-01 00:00:00'::timestamp without time zone) as last_active_date,
                        coalesce(
                            case when (select 1 from sso.member_campaigns c where c.member_id = m.id limit 1) = 1 then
                                ('[{"params":{"campaign":"' ||
                                (select coalesce(c.campaign_id, '0') from sso.member_campaigns c where c.member_id = m.id limit 1) ||
                                '","p":"' ||
                                (select coalesce(c.campaign_p, '') from sso.member_campaigns c where c.member_id = m.id limit 1) ||
                                '","p2": "' ||
                                (select coalesce(split_part(coalesce(c.affiliate_info->'user', '{}'::jsonb)->>'username', '-', 2), '') from sso.member_campaigns c where c.member_id = m.id limit 1) ||
                                '"}}]')
                            else case when m.cookie_path::text like '{%' then jsonb_build_array(m.cookie_path::jsonb)::text else cookie_path::text end
                            end,
                            '[{"params":{"campaign":"0","p":"-"}}]'
                    ) as cookie_path,
                    COALESCE(metadata,'{}'::jsonb) as metadata,
                    COALESCE((created_at at time zone 'UTC')::timestamp without time zone,'1970-01-01 00:00:00'::timestamp without time zone) as created_at,
                    COALESCE((updated_at at time zone 'UTC')::timestamp without time zone,'1970-01-01 00:00:00'::timestamp without time zone) as updated_at,
                    (deleted_at at time zone 'UTC')::timestamp without time zone as deleted_at,
                    COALESCE(first_name,'N/A') as first_name,
                    COALESCE(last_name,'N/A') as last_name,
                    promocode as promo_code,
                    (select COALESCE(json_object_agg(q.name,p.user_input),'{}'::json) from sso.member_profiles p,sso.profile_questions q where q.id=p.question_id and p.member_id=m.id AND q.id <> 3) as profile_information,
                    jsonb_build_object(
                    'member_campaign_id',''||coalesce(
                    case when (select 1 from sso.member_campaigns c where c.member_id = m.id limit 1) = 1 then
                            (select coalesce(c.campaign_id, '0') from sso.member_campaigns c where c.member_id = m.id limit 1)
                    else case when cookie_path::text like '{%' then
                        COALESCE((m.cookie_path#>>'{params,campaign}'),'0')::text
                        else COALESCE(m.cookie_path->(jsonb_array_length(m.cookie_path)-1)->'params'->>'campaign','0')::text end
                    end,
                    '0'),
                'campaign_id', (SELECT coalesce(campaign_id, '0') FROM sso.member_campaigns WHERE member_id = m.id LIMIT 1),
                'affiliate_id', (SELECT coalesce(c.affiliate_info->'user'->>'username', '0') FROM sso.member_campaigns c WHERE c.member_id = m.id LIMIT 1),
                'member_p_param', '' || (case when m.cookie_path::text like '{%' then COALESCE((m.cookie_path#>>'{params,p}'),'-')::text else
                        COALESCE(cookie_path->(jsonb_array_length(cookie_path)-1)->'params'->>'p','-')::text end),
                    'conversion_status',conversion_status,
                    'trading_status',trading_status,
                    'needs_verify',needs_verify,
                        'trading_status_reason',trading_status_reason,
                        'trading_status_reason_code',trading_status_reason_code,
                        'sales_agent_id',sales_agent_id,
                        'support_agent_id',support_agent_id,
                        'sales_agent_email',(select u.email from sso.admin_users u where u.id=m.sales_agent_id),
                        'support_agent_email',(select u.email from sso.admin_users u where u.id=m.support_agent_id),
                        'company', company,
                        'client_type', client_type,
                        'locale',locale,
                        'opt_in',opt_in_marketing,
                        'qftd', agent_effective_ftd,
                        'is_pool', is_pool,
                        'cookie_path', COALESCE(case when m.cookie_path::text like '{%' then jsonb_build_array(m.cookie_path::jsonb) else cookie_path end,'[{"params":{"campaign":"0","p":"-"}}]'::jsonb),
                        'nickname', nickname,
                        'white_label',white_label
                    ) as additional_attributes,
                    kyc_status,
                    converted_at,
                    kyc_rejection_reason_code,
                    extract(epoch from (NOW() at time zone 'UTC')) as query_submission_timestamp,
                    (extract(epoch from (updated_at AT TIME ZONE 'UTC')))::integer as update_epoch
                    from
                    sso.members m
                    where `
     return sql
    }
}
