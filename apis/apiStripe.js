const stripe = require('stripe')('sk_test_51NenYUAuF1shTlk3ct7g1KJogreZMIktEX6ME7wgTIKDQxPDClitOt3LYzjVXNWPptxQSuo1x3auXVxovz7NO63h00doZze53F');

async function createAccount (user) {

  const phone = "+" + user.phone
  const lastFourCharacters = user.idNumber.slice(-4)

    return(
        new Promise ((res, rej) => {
            stripe.accounts.create({
                type: 'custom',
                country: user.country,
                capabilities: {
                  transfers: {requested: true},
                  card_payments: user.country === "US" ?  {requested: true} : undefined
                },
                business_type: "individual",
                business_profile: {
                  mcc: "5734",
                  url: "www.google.com.ar",
                },
                /*company: {
                  address: {
                      city: "Millville",
                      line1: "2375 Pennsylvania Avenue",
                      postal_code: "08332",
                      state: "NJ",
                      },
                  name: "prueba",
                  phone: "+12027282330",
                  tax_id: "123456789"
                },*/
                tos_acceptance: {date: 1609798905, ip: '8.8.8.8', service_agreement: user.country==="GB" ? undefined : user.country === "US" ? undefined : 'recipient'},
                individual: {
                  id_number: user.country === "US" ? "123456789" : user.idNumber,
                  first_name: user.name,
                  last_name: user.lastName,
                  dob: {
                      day: user.dob.day,
                      month: user.dob.month,
                      year: user.dob.year
                      },
                  address: {
                      city: user.address.city,
                      line1: "address_full_match",
                      postal_code: user.address.postal_code,
                      state: user.address.state,
                      },
                  email: user.email,
                  phone: user.country === "US" ? "+12027282330" : "+447712345678" ,
                  ssn_last_4: user.country === "US" ? "6789" : undefined
              }  
            }).then(acount => {
                console.log(acount)
                res(acount)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function editAccountAddress (id, user) {
  return (
    new Promise (async (res, rej) => {
      stripe.accounts.update(
        id,
        {
          individual: 
          {
            address: {
              city: user.address.city,
              line1: user.address.line1,
              postal_code: user.address.postal_code,
              state: user.address.state,
            }
          }
          //"address_full_match"
        }
      ).then(account => {
        res(account)
      }).catch(error => {
        rej(error)
      })
    })
  )
}

function editUserDataAccount (id, user) {
  return(
    new Promise (async (res, rej) => {
      stripe.accounts.update(
        id,
        {
          email: user.email,
          phone: user.phone,
          individual: 
          {
            first_name: user.name,
            last_name: user.lastName,
          },
        }
      ).then(account => {
        res(account)
      }).catch(error => {
        rej(error)
      })
    })
  )
}

function createCustomer (name, lastName, email, phone) {
  return(
    new Promise ((res, rej) => {
      stripe.customers.create({
        description: 'Wallet User',
        name: name + lastName,
        email: email,
        phone: phone
      }).then(customer => {
        res(customer.id)
      }).catch(error => {
        rej(error)
      })
    })
  )
}

function createCard ( number, cvc, month, year, id, currency ) {
  return(
    new Promise ((res, rej) => {
      stripe.tokens.create({
        card: {
          number: number,
          exp_month: month,
          exp_year: year,
          cvc: cvc,
          currency: currency,
        },
      }).then(cardToken => {
          stripe.customers.createSource(
              id,
              {source: cardToken.id}
            ).then(card => {
              console.log(card)
              res(card)
          })
        }).catch(error => {
          console.log(error)
          rej(error)
        })
    })
  )
}

function createBanckAccount (id, name, lastName, country, currency, accountNumber) {
  return(
    new Promise ((res,rej) => {
      stripe.tokens.create({
        bank_account: {
          country: country,
          currency: currency,
          account_holder_name: name + lastName,
          account_holder_type: 'individual',
          routing_number: country==="US" ? '110000000' : "200000",
          account_number: accountNumber,
          //country==="US" ? '000123456789' : "00012345"
        },
      }).then(token => {
          console.log(token)
          stripe.accounts.update(
            id,
            {external_account: token.id}
        ).then(account => {
            res(account)
        }).catch(error => {
            console.log(error)
            rej(error)
        })
      }).catch(error => {
        console.log(error)
        rej(error)
      })
    })
  )
}

function getAccount (id) {
  return (
    new Promise ((res,rej) => {
      stripe.accounts.retrieve(
        id
      ).then(account => {
          console.log(account)
          res(account)
      })
    })
  )
}

function createCharge (id, amount, currency) {
  
  return(
    new Promise (async (res,rej)=>{
      await stripe.charges.create({
        amount: amount,
        currency: currency,
        customer: id,
        description: 'charge',
      }).then(charge =>{
        console.log(charge)
          res(charge)
      }).catch(error => {
        console.log(error, "?=?=?")
        rej(error)
      })
    })
  )
}

function getBalance () {
  return(
    new Promise ((res, rej) => {
      stripe.balance.retrieve().then(balance => {
        res(balance)
      }).catch(error => {console.log(error); rej(error)})
    })
  )
}

function withdraw (id, amount) {
  return(
    new Promise ((res, rej)=> {
      stripe.transfers.create({
        amount: amount,
        currency: 'GBP',
        destination: id,
      }).then(transfer => {
          res(transfer)
      }).catch(error => {
        console.log(error)
        rej(error)
      })
    })
  )
}

function withdraw2 (id, amount, currency) {
  return(
    new Promise ((res, rej)=> {
      stripe.transfers.create({
        amount: amount,
        currency: "GBP",
        destination: id,
      }).then(transfer => {
          res(transfer)
      }).catch(error => {
        console.log(error)
        rej(error)
      })
    })
  )
}

function createCardHolder (user) {
  return(
    new Promise(async (res, rej) => {
      stripe.issuing.cardholders.create({
        type: "individual",
        individual: {
          first_name: user.name,
          last_name: user.lastName,
          card_issuing: {
            user_terms_acceptance: {
              date: 1470266163,
              ip: "91.121.146.224"
            }
          }
        },
        name: user.name + " " + user.lastName,
        phone_number: user.phone,
        billing: {
          address: {
            line1 : user.address.line1,
            city: user.address.city,
            country: user.country,
            postal_code: user.address.postal_code
          }
        }
      }).then(cardHolder => {
        console.log(cardHolder)
        res(cardHolder)
      }).catch(error => {
        console.log(error)
        rej(error)
      })
    })
  )
}

function createCreditCard (holderId, user) {
  return (
    new Promise (async (res, rej) => {
      stripe.issuing.cards.create({
        cardholder: holderId,
        currency: user.currency,
        type: "virtual",
        status: "active",
        spending_controls: {
          spending_limits: [{
            amount: 1000000,
            interval: "monthly"
          }]
        }
      }).then(card => {
        console.log(card)
        //console.log(card.requirements.past_due)
        res(card)
      }).catch(error => {
        console.log(error)
        rej(error)
      })
    })
  )
}

function updateIssuingAccount (id) {
  return(
    new Promise (async (res, rej) => {
      stripe.accounts.update(
        id,
        {
          capabilities: {
            card_issuing: {
              requested: true,
            }
          }
        }
      ).then(acccount => {
        console.log(acccount)
        res(acccount)
      }).catch(error => {
        console.log(error)
        rej(error)
      })
    })
  )
}

function createPerson (id, user) {
    return(
      new Promise (async (res, rej) => {
        stripe.accounts.createPerson(
          id,
          {
            first_name: user.name,
            last_name: user.lastName,
            dob: {
              day: user.dob.day,
              month: user.dob.month,
              year: user.dob.year,
            },
            address: {
              line1 : user.address.line1,
              city: user.address.city,
              country: user.country,
              postal_code: user.address.postal_code
            },
            id_number: user.idNumber,
            email: user.email,
          }
        ).then(person => {
          res(person)
        }).catch(error => {
          console.log(error)
          rej(error)
        })
      })
    )
}

function addIssuingBalance (id) {
  return(
    new Promise ((res, rej)=> {
      stripe.transfers.create({
        amount: 1000000,
        currency: "GBP",
        destination: id,
        destination_balance: "issuing"
      }).then(transfer => {
          res(transfer)
      }).catch(error => {
        console.log(error)
        rej(error)
      })
    })
  )
}

function refoundCharge (transaction) {
  return(
    new Promise (async (res, rej) => {
      stripe.refunds.create({
        charge: transaction.id,
      }).then(re => {
        res(re)
      }).catch(error => {
        console.log(error);
        rej(error)
      })
    })
  )
}




module.exports = {
  createAccount,
  createCard,
  createBanckAccount,
  createCustomer,
  getAccount,
  getBalance,
  withdraw,
  editAccountAddress,
  editUserDataAccount,
  withdraw2,
  createCardHolder,
  createCreditCard,
  updateIssuingAccount,
  createPerson,
  addIssuingBalance,
  refoundCharge,
  createCharge
}