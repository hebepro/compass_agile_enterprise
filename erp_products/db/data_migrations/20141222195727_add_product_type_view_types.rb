class AddProductTypeViewTypes

  def self.up
    product_type_view_type = ViewType.create(description: 'Product Type Descriptions',
                                             internal_identifier: 'product_type_description')

    list = ViewType.create(description: 'List Description',
                            internal_identifier: 'list_description')
    list.move_to_child_of(product_type_view_type)

    short = ViewType.create(description: 'Short Description',
                            internal_identifier: 'short_description')
    short.move_to_child_of(product_type_view_type)

    long = ViewType.create(description: 'Long Description',
                            internal_identifier: 'long_description')
    long.move_to_child_of(product_type_view_type)
  end

  def self.down
    #remove data here
  end

end
