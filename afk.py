from idle_time import IdleMonitor

monitor = IdleMonitor.get_monitor()
prev = float(0)

while True:
	current = monitor.get_idle_time() 
	if current>60:
		# do nothing
		print(current)
	elif (current<5 and prev>60):
		# send to database
		print(prev)
		
	prev = monitor.get_idle_time()
	
