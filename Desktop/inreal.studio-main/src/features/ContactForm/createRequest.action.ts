'use server'

import { telegram } from '@/shared/api/telegram'

export const createRequest = async (prevState: any, formData: FormData): Promise<{ message: string, suggestion: string }> => {
	prevState

	const name = formData.get('name')
	const number = formData.get('tel')

	if (!name) {
		return {
			suggestion: 'Пожалуйста, введите ваше имя',
			message: ''
		}
	}

	if ((number as string).length !== 18) {
		return {
			suggestion: 'Введите номер телефона!',
			message: ''
		}
	}

	const response = await telegram.send(`Заявка от ${name} на номер ${number}`)

	return {
		suggestion: '',
		message: 'Заявка успешно отправлена'
	}


}