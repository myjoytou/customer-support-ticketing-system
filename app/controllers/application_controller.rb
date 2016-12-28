class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  around_action :wrap_in_transaction
  # before_action :redirect_user
  before_action :configure_permitted_parameters, if: :devise_controller?
  after_action :set_csrf_cookie_for_ng

  @@status = {
      success: "Success",
      failure: "Failure"
  }

  # def after_sign_in_path_for(resource)
  #   # stored_location_for(resource) ||
  #   if resource.is_a?(User) && resource.support?
  #     support_url
  #   elsif resource.is_a?(User) && resource.admin?
  #     admin_url
  #   else
  #     super
  #   end
  # end


  def wrap_in_transaction
    begin
      ActiveRecord::Base.transaction do
        FlashMessage.reset!
        yield
      end
    rescue Exception => e
      log_exception e
      flash[:error] = e.message
      response.status = 401
      response.body = e.message
    end
  end

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  def verified_request?
    super || valid_authenticity_token?(session, request.headers['X-XSRF-TOKEN'])
  end

  private
  def log_exception e
    logger.error "Rescued from " + e.message
    e.backtrace.each do |line|
      logger.error line
    end
  end

  # def redirect_user
  #   redirect_to support_url if user_signed_in? && current_user.support?
  #   redirect_to admin_url if user_signed_in? && current_user.admin?
  # end
end
