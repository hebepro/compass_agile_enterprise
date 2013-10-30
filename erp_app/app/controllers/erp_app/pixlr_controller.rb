module ErpApp
  class PixlrController < ActionController::Base

    def exit
      render 'close'
    end

    def save
      image_id = params[:title].split(':').first
      image = Image.find(image_id)

      if image
        data = open(params[:image])
        image.update_attributes({data: data})
      end

      render 'close'
    end

  end #Pixlr
end #ErpApp