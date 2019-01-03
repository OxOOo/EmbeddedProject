ssid = "GATE"
password = "12345678"

wifi.setmode(wifi.STATION)
wifi.sta.config(ssid, password)
print(wifi.sta.getip())

GPIO0 = 3
GPIO2 = 4
gpio.mode(GPIO0, gpio.OUTPUT)
gpio.mode(GPIO2, gpio.OUTPUT)
srv = net.createServer(net.TCP)
srv:listen(80, function(conn)
    conn:on("receive", function(client, request)
        local buf = ""
        buf = buf .. "HTTP/1.1 200 OK\r\nConnection: close\r\nContent-Type: text/html\r\n\r\n<h1>It works!</h1>\n"
        local _, _, method, path, qs = string.find(request, "([A-Z]+) (.+)?(.+) HTTP")
        if (method == nil) then
            _, _, method, path = string.find(request, "([A-Z]+) (.+) HTTP")
        end

        local querystring = {}
        if (qs ~= nil) then
            for k, v in string.gmatch(qs, "(%w+)=(%w+)&*") do
                querystring[k] = v
            end
        end

		payload = '<p><a href="/?gpio=0&cmd=high">high</a> <a href="/?gpio=0&cmd=low">low</a></p>\n'
		buf = buf .. payload
		io = nil
		if (querystring.gpio == "0") then
			io = GPIO0
		elseif (querystring.gpio == "2") then
			io = GPIO2
		end
		if (io ~= nil) then
			if (querystring.cmd == "high") then
				gpio.write(io, gpio.HIGH)
				print(io .. " high")
				msg = "OK"
			elseif (querystring.cmd == "low") then
				gpio.write(io, gpio.LOW)
				print(io .. " low")
				msg = "OK"
			else
				msg = "Unknown command."
			end
		else
			msg = "No such GPIO."
		end
		
        buf = buf .. "<p>" .. msg .. "</p>\n"
        client:send(buf)
        client:close()
        collectgarbage()
    end)
end)
