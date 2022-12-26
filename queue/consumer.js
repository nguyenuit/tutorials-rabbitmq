const amqplib = require('amqplib')

const amqp_url_cloud = 'amqps://zckikibk:wb2U_HzitlYu4dnk92C6TWSbSUN4hgew@armadillo.rmq.cloudamqp.com/zckikibk'

const receiveQueue = async () => {
    try {
        //1. create connection
        const conn = await amqplib.connect(amqp_url_cloud)
        //2. create channel
        const channel = await conn.createChannel()
        //3. create queue name
        const queueName = 'q1'
        //4. create queue
        await channel.assertQueue(queueName, {
            durable: false,
        })
        //5. receive to queue
        await channel.consume(queueName, msg => {
            console.log('Msg:', msg.content.toString())
        },{
            noAck: false
        })

        console.log('It\'s working!');
        //6. close connection and channel

    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

receiveQueue()