desc "Pings the app's URL to keep the dyno from spinning down"
task :ping_app do
	require 'net/http'
	Net::HTTP.get_response(URI(ENV['PING_URL'])) if ENV['PING_URL']
end
