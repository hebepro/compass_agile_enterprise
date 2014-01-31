require 'active_merchant'
require 'yaml'

module ErpCommerce
  module ActiveMerchantWrappers
    class AuthorizeNetWrapper
      
      def self.purchase(credit_card, amount, cvv, gateway_options={})
        result = {}
        
        login_information = YAML.load_file(File.join(Rails.root, 'config/authorize_net.yml')).symbolize_keys
      
        #setup gateway
        gateway = ActiveMerchant::Billing::AuthorizeNetGateway.new(login_information)

        #set credit card info
        credit_card_result = ActiveMerchant::Billing::CreditCard.new({
            :first_name         => credit_card.first_name_on_card,
            :last_name          => credit_card.last_name_on_card,
            :number             => credit_card.private_card_number,
            :month              => credit_card.expiration_month,
            :year               => credit_card.expiration_year,
            :verification_value => cvv,
            :brand              => ErpCommerce::ActiveMerchantWrappers::CreditCardValidation.get_card_type(credit_card.private_card_number)
          })

        if credit_card_result.valid?
          cents = (amount.to_d * 100)
          response = gateway.purchase(cents, credit_card_result, gateway_options)

          if response.success?
            result[:message] = response.message
            result[:payment] = Payment.new
            result[:payment].authorization_code = response.authorization
            result[:payment].success = true
            result[:payment].purchase
          else
            result[:message] = response.message
            result[:payment] = Payment.new
            result[:payment].success = false
            result[:payment].decline
          end

          gateway = PaymentGateway.create(
            :response => response.message,
            :payment_gateway_action => PaymentGatewayAction.find_by_internal_identifier('authorize')
          )

          result[:payment].payment_gateways << gateway
          result[:payment].save
        else
          result[:message] = "<ul>"
          credit_card_result.errors.full_messages.each do |current_notice_msg|
            result[:message] << "<li>"
            result[:message] << current_notice_msg
            result[:message] << "</li>"
          end
          result[:message] << "<ul>"
        end

        result
      end
      
    end #AuthorizeNetWrapper
  end #ActiveMerchantWrapper
end #ErpCommerce