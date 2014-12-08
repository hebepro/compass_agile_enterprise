require 'aasm'

#compass_ae libraries
require 'erp_base_erp_svcs'

require 'paperclip'
require 'delayed_job'
require 'delayed_job_active_record'
require 'mail_alternatives_with_attachments'
require 'sorcery'
require 'pdfkit'
require 'aws'
require 'activerecord-postgres-hstore'
require 'nested-hstore'
require "erp_tech_svcs/version"
require "erp_tech_svcs/utils/compass_logger"
require "erp_tech_svcs/utils/default_nested_set_methods"
require "erp_tech_svcs/utils/compass_access_negotiator"
require "erp_tech_svcs/extensions"
require 'erp_tech_svcs/file_support'
require 'erp_tech_svcs/sms_wrapper'
require "erp_tech_svcs/config"
require "erp_tech_svcs/engine"
require 'erp_tech_svcs/sessions/delete_expired_sessions_job'
require 'erp_tech_svcs/sessions/delete_expired_sessions_service'
require 'erp_tech_svcs/erp_tech_svcs_audit_log'
module ErpTechSvcs
end
