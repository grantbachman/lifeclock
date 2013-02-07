require 'rack'
require 'pg'
require 'erb'

class MyApp

	@header = {"Content-Type" => "text/html"}
	@not_found = [404, @header, ["Not found"]]
	@conn_hash ={:dbname => ENV['dbname'], :host => ENV['host'], :port => ENV['port'],
					:user => ENV['user'], :password => ENV['password'], :sslmode => ENV['sslmode'] }
	
	def self.call(env)	
		req = Rack::Request.new(env)
		case req.path 
			when '/'
				file = ERB.new(File.read('index.html.erb')).result(binding)
				[200, @header, [file]]
			when '/setBirthdayPath'
				if req.post?
					string = req.params['month'] << req.params['day'] << req.params['year']
					@header["Location"] = "/#{string}"
					[302, @header, []]
				else
					@not_found
				end
			when /\d{8}/ 
				file = ERB.new(File.read('clock.html.erb')).result(binding)	
				[200, @header, [file]]
			when '/create'
				if req.post?	
					text, days = req.params['reaction'], req.params['days']
					# remove HTML tags and replace carriage returns with <br />
					text.gsub(/<\/?[^>]*>/, '').gsub!(/(\r\n)+/,"<br />")
					conn = PG::Connection.new(@conn_hash)
					insert = conn.exec('INSERT INTO reactions (text,days) VALUES ($1,$2)', [text, days])
					conn.close
					# post/redirect/get -- prevent from double posting with refresh
					@header["Location"] = "/posts"
					[302, @header, []]
				else
					@not_found
				end
			when '/posts'
				conn = PG::Connection.new(@conn_hash)
				posts = conn.exec('SELECT * FROM reactions')
				file = ERB.new(File.read('posts.html.erb')).result(binding)
				posts.clear
				conn.close
				[200, @header, [file]]
			else
				@not_found	
		end
	end


end

use Rack::Static, urls: ['/assets']
run MyApp

