require "spec_helper"
require "erp_dev_svcs"

describe Knitkit::ErpApp::Desktop::WebsiteSectionController do

  before(:each) do 
    basic_user_auth_with_admin
    @website = FactoryGirl.create(:website, :name => "Some name")
    @website.hosts << FactoryGirl.create(:website_host)
  end

  describe "POST new" do

    it "should create a new website section" do
      post :new, {:use_route => :knitkit,
                     :action => "new",
                     :website_id => @website.id,
                     :title => "Some New Title"}

      parsed_res = JSON.parse(response.body)
      parsed_res['success'].should eq(true)
    end
    
    it "title can not be 'blog' if section is a blog" do
      post :new, {:use_route => :knitkit,
                     :action => "new",
                     :website_id => @website.id,
                     :title => "Blog", 
                     :type => "Blog"}

      parsed_res = JSON.parse(response.body)
      parsed_res['success'].should eq(false)
    end

    it "can be a child of another section" do
      @website_section = FactoryGirl.create(:website_section)
      @website.website_sections << @website_section
      post :new, {:use_route => :knitkit,
                     :action => "new",
                     :website_id => @website.id,
                     :title => "Some New Title",
                     :website_section_id => @website_section.id}

      parsed_res = JSON.parse(response.body)
      parsed_res['success'].should eq(true)
      
    end

    
    it "should fail to save if no title is given" do
      post :new, {:use_route => :knitkit,
                     :action => "new",
                     :website_id => @website.id}

      parsed_res = JSON.parse(response.body)
      parsed_res['success'].should eq(false)
    end
  end

  describe "Post delete" do
    before(:each) do
      @website_section = FactoryGirl.create(:website_section)
      @website.website_sections << @website_section
    end

    it "should delete the given section" do
      post :delete, {:use_route => :knitkit,
                     :action => "delete",
                     :id => @website_section.id}
      parsed_res = JSON.parse(response.body)
      parsed_res['success'].should eq(true)
    end
  end
  
  describe "Post update_security" do
    before(:each) do
      @website_section = FactoryGirl.create(:website_section)
      @website.website_sections << @website_section
    end
    
    it "should secure the section given secure = true" do
      post :update_security, {:use_route => :knitkit,
                     :action => "update_security",
                     :id => @website_section.id,
                     :site_id => @website.id,
                     :secure => "true"}           
    end
    
    it "should unsecure the section given secure = false" do
      @website_section_double = double("WebsiteSection")
      WebsiteSection.should_receive(:find).and_return(@website_section_double)
      @website_section_double.should_receive(:remove_capability)
      
      post :update_security, {:use_route => :knitkit,
                     :action => "update_security",
                     :id => @website_section.id,
                     :site_id => @website.id,
                     :secure => "false"}
    end
  end

  describe "Post update" do
    before(:each) do
      @website_section = FactoryGirl.create(:website_section)
      @website.website_sections << @website_section
    end

    it "should save" do
      post :update, {:use_route => :knitkit,
                     :action => "update",
                     :id => @website_section.id,
                     :in_menu => "yes",
                     :title => "some title",
                     :internal_identifier => "some-title"}

      parsed_res = JSON.parse(response.body)
      parsed_res['success'].should eq(true)
    end

    it "should return false if website_section.save returns false" do
      post :update, {:use_route => :knitkit,
                     :action => "update",
                     :id => @website_section.id,
                     :in_menu => "yes",
                     :internal_identifier => "some-title"}

      parsed_res = JSON.parse(response.body)
      parsed_res['success'].should eq(false)
    end
  end

  describe "Post add_layout" do

    it "should call create_layout" do
      @website_section = FactoryGirl.create(:website_section)
      @website.website_sections << @website_section
      @website_section_double = double("WebsiteSection")
      WebsiteSection.should_receive(:find).and_return(@website_section_double)
      @website_section_double.should_receive(:create_layout)

      post :add_layout, {:use_route => :knitkit,
                     :action => "add_layout",
                     :id => @website_section.id}
    end
  end

  describe "Get get_layout" do
    it "should call layout" do
      @website_section = FactoryGirl.create(:website_section)
      @website.website_sections << @website_section
      @website_section_double = double("WebsiteSection")
      WebsiteSection.should_receive(:find).and_return(@website_section_double)
      @website_section_double.should_receive(:layout)

      get :get_layout, {:use_route => :knitkit,
                    :action => "get_layout",
                    :id => @website_section.id}
    end
  end

  describe "Post save_layout" do
    before(:each) do
      @website_section = FactoryGirl.create(:website_section)
      @website.website_sections << @website_section
    end

    it "should save layout" do
      post :save_layout, {:use_route => :knitkit,
                     :action => "save_layout",
                     :id => @website_section.id,
                     :content => "some text"}

      parsed_res = JSON.parse(response.body)
      parsed_res['success'].should eq(true)
    end
  end

  describe "Get available_articles" do
    it "should return the internal_identifier and id of all articles not attatched to the given section" do
      if Object.class_exists?('WorkflowProcess')
        WorkflowProcess.create(:internal_identifier => "test_content_mgmt", :process_template => true)
        WorkflowStep.create(:internal_identifier => "Start", :executable_command_id => 1, :executable_command_type => "ManualWorkflowStep", :workflow_process_id => 1, :initial_step => true)
      end
      @website_section = FactoryGirl.create(:website_section)
      @website.website_sections << @website_section
      @article = FactoryGirl.create(:article, :internal_identifier => "article_1", :created_by_id => 1)
      @website_section.contents << @article

      @website_section_2 = FactoryGirl.create(:website_section)
      @website.website_sections << @website_section_2
      @article_2 = FactoryGirl.create(:article, :internal_identifier => "article_2", :created_by_id => 1)
      @website_section_2.contents << @article_2

      get :available_articles, {:use_route => :knitkit,
                     :action => "available_articles",
                     :section_id => @website_section.id}

      parsed_res = JSON.parse(response.body)
      #puts parsed_res.inspect
      parsed_res['articles'][0]["internal_identifier"].should eq(@article_2.internal_identifier)
      parsed_res['articles'][0]["id"].should eq(@article_2.id)
    end
  end

  describe "Get existing_sections" do
    it "should call website.sections.to_json with :only => [:id], :methods => [:title_permalink]" do
      @website_section = FactoryGirl.create(:website_section, :title => "some_title")
      @website.website_sections << @website_section

      get :existing_sections, {:use_route => :knitkit,
                     :action => "existing_sections",
                     :website_id => @website.id}

      parsed_res = JSON.parse(response.body)
      parsed_res[0]["id"].should eq(@website_section.id)
      parsed_res[0]["title_permalink"].should eq("some_title - /")
    end
  end
end
