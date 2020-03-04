const { parseISO, isBefore, subHours } = require('date-fns')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token')

class ResetPasswordController {
    async store({ request, response }) {
        const { token, password } = request.only(['token', 'password'])

        const usertoken = await Token.findByOrFail('token', token)

        if (isBefore(parseISO(usertoken.created_at), subHours(new Date(), 2))) {
            return response
                .status(400)
                .json({ error: 'Invalid date range, pleasy try again.' })
        }

        const user = await usertoken.user().fetch()

        user.password = password
        await user.save()

        return response.status(204)
    }
}

module.exports = ResetPasswordController
