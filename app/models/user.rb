class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :name, presence: true

  has_many :tickets

  def deactivate
    self.is_active = false
    self.save!
  end

  def assign_role(role)
    self[role] = true
    self.save!
  end

  def deny_role(role)
    self[role] = false
    self.save!
  end

  def activate
    self.is_active = true
    self.save!
  end

  def active_for_authentication?
    super && self.is_active?
  end

  def inactive_message
    self.is_active? ? super : "User is not allowed to sign in! Please contact your admin"
  end

end
