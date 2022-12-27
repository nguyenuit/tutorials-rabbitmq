const amqplib = require('amqplib')

const amqp_url_cloud = 'amqps://zckikibk:wb2U_HzitlYu4dnk92C6TWSbSUN4hgew@armadillo.rmq.cloudamqp.com/zckikibk'
const amqp_url_docker = 'amqp://localhost:5672'

const receiveNoti = async () => {
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

        //4. create queue
        const {
            queue
        } = await channel.assertQueue('',{
            exclusive: true
        })

        console.log(`queueName::: ${queue}`)
        
        //5. binding
        await channel.bindQueue(queue, exChangeName, '')

        await channel.consume(queue, msg => {
            console.log(`msg::`, msg.content.toString())
        },{
            noAck: true
        })

    } catch (error) {
        console.log(error.message)
    }
}

receiveNoti()

