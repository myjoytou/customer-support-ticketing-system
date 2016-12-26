class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  around_action :wrap_in_transaction

  before_action :configure_permitted_parameters, if: :devise_controller?

  @@status = {
      success: "Success",
      failure: "Failure"
  }

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

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  private
  def log_exception e
    logger.error "Rescued from " + e.message
    e.backtrace.each do |line|
      logger.error line
    end
  end
end
