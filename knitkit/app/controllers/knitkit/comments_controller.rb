module Knitkit
  class CommentsController < BaseController
    def add
      user    = current_user
      content = Content.find(params[:content_id])
      comment = params[:comment]

      @comment = content.add_comment({:commentor_name => user.party.description, :email => user.email, :comment => comment})

      if @comment.valid?
        render :json => {:success => true, :message => 'Comment pending approval'}
      else
        render :json => {:success => false, :message => 'Error. Comment cannot be blank'}
      end
    end

    #no section to set
    def set_section
      false
    end

  end
end
