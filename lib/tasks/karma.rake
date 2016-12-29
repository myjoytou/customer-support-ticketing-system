namespace :karma  do
  task :start_customer => :environment do
    with_tmp_config :start, :customer
  end

  task :run_customer => :environment do
    exit with_tmp_config :start, "--single-run"
  end

  task :start_support => :environment do
    with_tmp_config :start, :support
  end

  task :run_support => :environment do
    exit with_tmp_config :start, "--single-run"
  end

  task :start_admin => :environment do
    with_tmp_config :start, :admin
  end

  task :run_admin => :environment do
    exit with_tmp_config :start, "--single-run"
  end

  private

  def with_tmp_config(command, role, args = nil)
    Tempfile.open("karma_unit_#{role.to_s}.js", Rails.root.join('tmp')) do |f|
      f.write unit_js(role)
      f.flush

      system "./node_modules/karma/bin/karma #{command} #{f.path} #{args}"
    end
  end

  def read_file_customer
    File.open('spec/karma/config/unit_customer.js', 'r').read
  end

  def read_file_support
    File.open('spec/karma/config/unit_support.js', 'r').read
  end

  def read_file_admin
    File.open('spec/karma/config/unit_admin.js', 'r').read
  end

  def unit_js(role)
    files = ['app/assets/javascripts/application.js']
    if role == :customer
      unit_js = read_file_customer
    elsif role == :support
      unit_js = read_file_support
    else
      puts '========================== opening admin file'
      unit_js = read_file_admin
    end
    unit_js.gsub "APPLICATION_SPEC", "\"#{files.join("\",\n\"")}\""
  end
end
