const amqplib = require('amqplib')

const amqp_url_cloud = 'amqps://zckikibk:wb2U_HzitlYu4dnk92C6TWSbSUN4hgew@armadillo.rmq.cloudamqp.com/zckikibk'
const amqp_url_docker = 'amqp://localhost:5672'

const postVideo = async ({ msg }) => {
    try {
        //1. create connection
        const conn = await amqplib.connect(amqp_url_cloud)

        //2. create channel
        const channel = await conn.createChannel()

        //3. create exchange
        const exChangeName = 'video'

        await channel.assertExchange(exChangeName, 'fanout', {
            durable: false
        })

        //4. publish video
        await channel.publish(exChangeName, '', Buffer.from(msg))

        console.log(`[x] Send OK:::${msg}`)

        setTimeout(function(){
            conn.close()
            process.exit(0)
        }, 2000)    
    } catch (error) {
        console.log(error.message)
    }
}

const msg = process.argv.slice(2).join(' ') || 'Hello ExChange'
postVideo({msg})

