const http = require('http')
const fs = require('fs/promises')
const PORT = process.env.PORT || 4000
const server = http.createServer( async (request, response) => {
 	if (request.url === "/api/users" && request.method === 'GET'){
		response.setHeader('Content-Type', 'application/json')
		response.end(
			await fs.readFile('./database/data.json')
			)

	}else if (request.url === "/api/users" && request.method === 'POST'){
		let data  = ''
		let tr = true
		request.on('data', buffer => data+=buffer)
		request.on('end', async () => {
			let users = await fs.readFile('./database/data.json','utf-8')
			users = users ? JSON.parse(users) : []

			let id = 100000 + Math.random() * 900000 | 0    
			let listId = users.map(el => el.id)
			id  = listId.includes(id) ? (100000 + Math.random() * 900000 | 0) : id 
			let newuser = JSON.parse(data)
			newuser.id = id
			users.map(e  => {
				let cid = users.map(el => el.id) ? users.map(el => el.id) : id
				if(e.user.toLowerCase() == newuser.user.toLowerCase() && e.parol == newuser.parol){
					response.end(JSON.stringify(cid))
					tr = false
				}else if(e.user.toLowerCase() == newuser.user.toLowerCase() && e.parol != newuser.parol){
					response.end(JSON.stringify("Parol noto'g'ti"))
					tr = false
				}else{
					tr = true
				}
			})
			if (!tr) return 
			users.push(newuser)
			response.end(JSON.stringify(id))
			await fs.writeFile('./database/data.json',JSON.stringify(users,null,4))
		})

	}else if (request.url === "/api/users/profile" && request.method === 'POST'){
		let data  = ''
		request.on('data', buff => data+=buff)
		request.on('end', async () => {
			let users = await fs.readFile('./database/data.json','utf-8')
			users = users ? JSON.parse(users) : []
			let newuser = JSON.parse(data)
			users.map(el => {
				if(newuser.id == el.id){
					let obj = {}
					let text = el.text ? el.text : []
					obj.title = newuser.title
					obj.text = newuser.text
					text.push(obj)
					users.text = text
				}
			})
			await fs.writeFile('./database/data.json',JSON.stringify(users,null,4))
			response.end('recuired')
		})
		
	}else if (request.url === "/users" && request.method === 'GET'){
		response.setHeader('Content-Type', 'text/html')
		response.end(
			await fs.readFile('./user.html')
		)	

	}else if (request.url === "/newuser" && request.method === 'GET'){
		response.setHeader('Content-Type', 'text/html')
		response.end(
			await fs.readFile('./login.html')
		)		

	}else if (request.url === "/" && request.method === 'GET'){
		response.setHeader('Content-Type', 'text/html')
		response.end(
			await fs.readFile('./index.html')
		)		

	}else if (request.url === "/post" && request.method === 'GET'){
		response.setHeader('Content-Type', 'text/html')
		response.end(
			await fs.readFile('./post.html')
		)		

	}else if (request.url === "/profile" && request.method === 'GET'){
		response.setHeader('Content-Type', 'text/html')
		response.end(
			await fs.readFile('./profile.html')
		)		

	}else {
		response.end('Not found')
	}
} )

server.listen(PORT, () => console.log("Server is runing http://192.168.10.10:4000"))
