//process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Word = require('../app/models/word');
let User = require('../app/models/user');


let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

// describe('Words', () => {
//     beforeEach((done) => {
//         Word.remove({}, (err) => {
//            done();
//         });
//     });
  describe('/GET words', () => {
      it('it should GET all the Words in the thesaurus', (done) => {
            chai.request(server)
            .get('/api/word/listWords')
            .end((err, res) => {
                res.should.have.status(200);              
                res.body.should.be.a('object');
                res.body.success.should.be.eql(true);
                // res.body.length.should.be.above(1);
              done();
            });
      });
  });



  describe('/POST register new user', () => {
      it('it should POST a new user object', (done) => {
        let user = {
            username: "OisinsTestUsername",
            email: "oisinstest@email.com",
            password: "someSortOfPassword",
            uuid: "8bf036f0-4dcc-46c2-bd3d-706d79e332c9"
        }
            chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(true);

                //res.body.should.have.property('errors');
                //res.body.errors.should.have.property('pages');
                //res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });

      it('it should not POST a new user without username field', (done) => {
        let user = {            
            email: "oisinstest@email.com",
            password: "someSortOfPassword",
            uuid: "8bf036f0-4dcc-46c2-bd3d-706d79e332c9"
        }
            chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                //I need to go about setting the response codes myself
                // res.should.have.status(200);
                res.body.should.be.a('object');
                // res.body.should.have.property('errors');
                res.body.errors.should.have.property('username');
                // res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });

    });

//   describe('/GET/:id book', () => {
//       it('it should GET a book by the given id', (done) => {
//         let book = new Book({ title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, pages: 1170 });
//         book.save((err, book) => {
//             chai.request(server)
//             .get('/book/' + book.id)
//             .send(book)
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('title');
//                 res.body.should.have.property('author');
//                 res.body.should.have.property('pages');
//                 res.body.should.have.property('year');
//                 res.body.should.have.property('_id').eql(book.id);
//               done();
//             });
//         });

//       });
//   });
//  /*
//   * Test the /PUT/:id route
//   */
//   describe('/PUT/:id book', () => {
//       it('it should UPDATE a book given the id', (done) => {
//         let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
//         book.save((err, book) => {
//                 chai.request(server)
//                 .put('/book/' + book.id)
//                 .send({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1950, pages: 778})
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('object');
//                     res.body.should.have.property('message').eql('Book updated!');
//                     res.body.book.should.have.property('year').eql(1950);
//                   done();
//                 });
//           });
//       });
//   });
// });
