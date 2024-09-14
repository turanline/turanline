export const telegram = {
	send: async (message: string) => {
		await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.ORDERS_CHAT_ID}&text=${message}`)
	}
}