require 'rack'
require 'erb'

class Filter
	def initialize(app)
		@app = app
	end

	def call(env)
		if env['PATH_INFO'] == '/safe'
			status, headers, body = @app.call(env)
			swears = %w(fuck shit cunt pussy dick damn cock birthday)
			body.each do |x|
				swears.each do |word|
					stars = ''
					(word.length-2).times { stars << '*' }
					new_swear = word[0] + stars + word[-1]
					x.gsub!(/#{word}/, new_swear)
				end
			end
			[status, headers, body]
		else
			@app.call(env)
		end
	end
end

class MyApp
	def self.call(env)	
		me = "birthday."
		file = ERB.new(File.read('index.html.erb'))	
		return [200, {"Content-Type" => "text/html"}, [file.result(binding)]]
	end
end

use Rack::Static, urls: ['/assets']
#use Filter
run MyApp

