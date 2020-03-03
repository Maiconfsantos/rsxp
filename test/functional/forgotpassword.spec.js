const { test, trait } = use('Test/Suite')('Forgot Password');

const Mail = use('Mail');


/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Factory = use('Factory');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const User = use('App/Models/User');


trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should send a email with reset password instructions', async ({ assert, client }) =>{

    Mail.fake();

    const forgotPayload = {
        email: 'maiconfsanto@gmail.com',
    };

    const user = await Factory
        .model('App/Models/User')
        .create(forgotPayload);

    const response = await client
        .post('/forgot')
        .send(
            forgotPayload
        ).end();

    response.assertStatus(200);
    
    const recentEmail = Mail.pullRecent();
    assert.equal(recentEmail.message.to[0].address, forgotPayload.email);

    Mail.restore();

    
});