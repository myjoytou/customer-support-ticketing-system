class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def active_for_authentication?
    super && self.is_active?
  end

  def inactive_message
    self.is_active? ? super : "User is not allowed to sign in! Please contact your admin"
  end
  validates :name, presence: true

  has_many :tickets
end
