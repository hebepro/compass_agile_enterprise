ErpBaseErpSvcs::Engine.routes.draw do

  namespace 'shared' do
    resources 'units_of_measurement'
  end

end
