#### Table Definition ###########################
#  create_table :invoice_party_roles do |t|
#    t.string :description
#    t.integer :role_type_id
#    t.string :external_identifier
#    t.string :external_id_source
#    t.references :invoice
#    t.references :party

#    t.timestamps
#  end

#  add_index :invoice_party_roles, :invoice_id, :name => 'invoice_party_invoice_id_idx'
#  add_index :invoice_party_roles, :party_id, :name => 'invoice_party_party_id_idx'
#################################################

class InvoicePartyRole < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to  :invoice
  belongs_to  :party
  belongs_to  :role_type  

end
