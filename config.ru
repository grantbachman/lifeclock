require 'rack'
require 'erb'
require 'pg'

class Filter
	def initialize(app)
		@app = app
	end

	def call(env)
		status, headers, body = @app.call(env)
		swears = %w(fuck shit cunt pussy dick damn cock)
		body.each do |x|
			swears.each do |word|
				stars = ''
				(word.length-2).times { stars << '*' }
				new_swear = word[0] + stars + word[-1]
				x.gsub!(/#{word}/, new_swear)
			end
		end
		[status, headers, body]
	end
end

class MyApp
	def self.call(env)	
		req = Rack::Request.new(env)
		puts env['posted'].inspect
		case req.path 
			when '/'
				file = ERB.new(File.read('index.html.erb')).result(binding)
				return [200, {"Content-Type" => "text/html"}, [file]]
			when '/create'
				if req.post?	
					text = req.params['reaction']
					# remove HTML tags and replace carriage returns with <br />
					text.gsub(/<\/?[^>]*>/, '').gsub!(/(\r\n)+/,"<br />")
					conn = PG::Connection.new(:dbname => 'doomsday', :host => 'localhost', :port => 5432)
					insert = conn.exec('INSERT INTO reactions (text) VALUES ($1)', [text])
					conn.finish
					# post/redirect/get -- prevent from double posting with refresh
					response = Rack::Response.new
					response.redirect('/posts')
					response.finish
				end
			when '/posts'
				conn = PG::Connection.new(:dbname => 'doomsday', :host => 'localhost', :port => 5432)
				posts = conn.exec('SELECT * FROM reactions')
				file = ERB.new(File.read('posts.html.erb')).result(binding)
				posts.clear
				return [200, {"Content-Type" => "text/html"}, [file]]
			else
				return [404, {"Content-Type" => "text/html"}, ["Not found"]]
		end
	end


end

use Rack::Static, urls: ['/assets']
#use Filter
run MyApp

