const request = require('supertest');
const app = require('./app');


describe("Test express Api", () => {
    it('GET /allspend ---> JSON data', () => {
        return request(app)
            //ON TESTE LA ROUTE ALLSPEND
            .get('/allspend')
            //ON S'ATTEND A UN JSON ENCODE EN UTF8
            .expect("Content-Type", "application/json; charset=utf-8")
            //STATUT 200 TOUT VA BIEN
            .expect(200)
            .then((response) => {
                //ON ATTEND QUE LA REPONSE SOIT EGALE A CE QU'IL Y A APRES
                expect(response.body).toEqual(
                    //LE RESULTAT EST CONTENU DANS UN TABLEAU
                    expect.arrayContaining([
                        //CONTIENT UN OBJET
                        expect.objectContaining({
                            //DATE DEPENSE DE TYPE STRING
                            date_depense: expect.any(String),
                            //LOGONAME DE TYPE STRING
                            logoName: expect.any(String)
                        })
                    ])
                )
            })

    });

    it('GET /spend/:id ---> SPEND ID', () => {
        return request(app)

            .get('/spend/6551e47dcc6706e076f590a4')

            .expect("Content-Type", "application/json; charset=utf-8")

            .expect(200)
            .then((response) => {

                expect(response.body).toEqual(

                    expect.objectContaining({
                        type: expect.any(String),
                        remarque_depense: expect.any(String)
                    })

                )
            })
    })

    it('POST /submit-spend ---> created post', () => { 
        return request(app)

        .post('/submit-spend')
        .send({
            date_depense: "21/03/2024",
            remarque_depense: "Remarque"
        })

        .expect("Content-Type", "application/json; charset=utf-8")

        .expect(201)
        .then((response) => {

            expect(response.body).toEqual(

                expect.objectContaining({
                    type: expect.any(String),
                    remarque_depense: expect.any(String)
                })

            )
        })
    })

})