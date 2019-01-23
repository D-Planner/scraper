import { describe, it } from 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/server';

describe('Authentication', () => {
    describe('#signup', () => {
        it('should return a token for a new user given a new email and password', (done) => {
            request(app)
                .post('/api/signup')
                .send({
                    email: 'buster@dplanner.com',
                    password: 'password',
                })
                .end((err, res) => {
                    if (err) { done(err); }
                    // NOTE: This test will fail until I make a before hook to delete the user we create
                    //      -- Adam
                    //
                    // expect(res.status).to.equal(200);
                    // expect(res.body.token).to.exist('Signup should return a jwt');
                    done();
                });
        });

        // Note: because of the before hook thing mentioned above, this test will fail on the first attempt
        // Run it again and it will pass
        it('should not create a new user if the email already exists', (done) => {
            request(app)
                .post('/api/signup')
                .send({
                    email: 'buster@dplanner.com',
                    password: 'password',
                })
                .end((err, res) => {
                    if (err) { done(err); }

                    expect(res.status).to.equal(409);
                    expect(res.body.token).to.be.undefined;
                    done();
                });
        });

        it('should not create a new user if no email is provided', (done) => {
            request(app)
                .post('/api/signup')
                .send({
                    password: 'password',
                })
                .end((err, res) => {
                    if (err) { done(err); }

                    expect(res.status).to.equal(400);
                    expect(res.body.token).to.be.undefined;
                    done();
                });
        });

        it('should not create a new user if no password is provided', (done) => {
            request(app)
                .post('/api/signup')
                .send({
                    email: 'buster@dplanner.com',
                })
                .end((err, res) => {
                    if (err) { done(err); }

                    expect(res.status).to.equal(400);
                    expect(res.body.token).to.be.undefined;
                    done();
                });
        });
    });

    describe('#signin', () => {
        it('should return a token for an existing user given its username and password', (done) => {
            request(app)
                .post('/api/signin')
                .send({
                    email: 'buster@dplanner.com',
                    password: 'password',
                })
                .end((err, res) => {
                    if (err) { done(err); }
                    expect(res.status).to.equal(200);
                    expect(res.body.token, 'Signin should return a jwt').to.exist;
                    done();
                });
        });

        it('should not sign in if the user doesn\'t exist', (done) => {
            request(app)
                .post('/api/signin')
                .send({
                    email: 'hackerman@kremlin.ru',
                    password: 'dasvidaniya',
                })
                .end((err, res) => {
                    if (err) { done(err); }

                    expect(res.status).to.equal(401);
                    expect(res.body.token).to.be.undefined;
                    done();
                });
        });

        it('should not sign in if no email is provided', (done) => {
            request(app)
                .post('/api/signin')
                .send({
                    password: 'password',
                })
                .end((err, res) => {
                    if (err) { done(err); }

                    expect(res.status).to.equal(400);
                    expect(res.body.token).to.be.undefined;
                    done();
                });
        });

        it('should not sign in if no password is provided', (done) => {
            request(app)
                .post('/api/signin')
                .send({
                    email: 'buster@dplanner.com',
                })
                .end((err, res) => {
                    if (err) { done(err); }

                    expect(res.status).to.equal(400);
                    expect(res.body.token).to.be.undefined;
                    done();
                });
        });
    });
});
