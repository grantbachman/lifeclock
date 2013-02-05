require 'rack'
require 'erb'
require 'pg'

class MyApp
	def self.call(env)	
		req = Rack::Request.new(env)
		case req.path 
			when '/'
				file = ERB.new(File.read('index.html.erb')).result(binding)
				return [200, {"Content-Type" => "text/html"}, [file]]
			when '/clock'
				if req.post?
					string = req.params['month'] << req.params['day'] << req.params['year']
					response = Rack::Response.new
					response.redirect("/#{string}")
					response.finish
				end
			when /\d{8}/ 
				file = ERB.new(File.read('clock.html.erb')).result(binding)	
				return [200, {"Content-Type" => "text/html"}, [file]]
			when '/create'
				if req.post?	
					text = req.params['reaction']
					days = req.params['days']
					# remove HTML tags and replace carriage returns with <br />
					text.gsub(/<\/?[^>]*>/, '').gsub!(/(\r\n)+/,"<br />")
					conn = PG::Connection.new(:dbname => 'doomsday', :host => 'localhost', :port => 5432)
					insert = conn.exec('INSERT INTO reactions (text,days) VALUES ($1,$2)', [text, days])
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

