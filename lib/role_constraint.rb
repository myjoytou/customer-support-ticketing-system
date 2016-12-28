class RoleConstraint
  def initialize(role)
    @role = role
  end
  def matches?(request)
    request.env['warden'].user.try(@role.to_s).present?
  end
end