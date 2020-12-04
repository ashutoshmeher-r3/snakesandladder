const app = angular.module('snlApp', ['ui.bootstrap', 'toastr']);

let httpHeaders = {
        headers : {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

app.controller('AppController', function($http, toastr, $uibModal) {
    const demoApp = this;
    const apiBaseURL = "/api/snl/";

    demoApp.landingScreen = false;
    demoApp.gameScreen = true;
    demoApp.showSpinner = false;
//    demoApp.showAuctionSpinner = false;
//    demoApp.showAssetSpinner = false;
    demoApp.player1 = "";
    demoApp.player2 = "";
    demoApp.dice = {
        diceRollFlag : false,
        roll: 6,
        id: "die-6"
    }


    demoApp.startGame = () => {
        demoApp.showSpinner = true;
        $http.post(apiBaseURL + 'createGame', {player1: demoApp.player1, player2: demoApp.player2})
        .then((response) => {
            if(response.data && response.data.status){
                toastr.success('Game Created Successfully!');
                const gameId = response.data.data;
                demoApp.gameScreen = true;
                demoApp.landingScreen = false;
                demoApp.fetchGame(gameId);
            }else{
                toastr.error(response.data? response.data.message: "Something went wrong. Please try again later!");
            }
            demoApp.showSpinner = false;
        });
    }

    demoApp.rollDice = () => {
        demoApp.dice.diceRollFlag = !demoApp.dice.diceRollFlag;
        var min = Math.ceil(1);
        var max = Math.floor(6);
        var roll = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(roll);
        demoApp.dice.roll = roll;
        demoApp.dice.id = "die-" + roll;
    }

    demoApp.loadGame = (gameId) => {
    }

    demoApp.openCreateAccountModal = () => {
        const accountModel = $uibModal.open({
            templateUrl: 'createAccountModal.html',
            controller: 'CreateAccountModalCtrl',
            controllerAs: 'createAccountModalCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                demoApp: () => demoApp,
                apiBaseURL: () => apiBaseURL,
                toastr: () => toastr,
            }
        });

        accountModel.result.then(() => {}, () => {});
    };

    demoApp.fetchGame = (gameId) => {
       $http.get(apiBaseURL + 'getGame/' + gameId)
       .then((response) => {
          if(response.data && response.data.status){
              demoApp.game = response.data.data;
          }else{
              toastr.error(response.data? response.data.message: "Something went wrong. Please try again later!");
          }
       });
    }

//
//    demoApp.switchParty = (party) => {
//        $http.post(apiBaseURL + 'switch-party/' + party)
//        .then((response) => {
//           if(response.data && response.data.status){
//               demoApp.balance = response.data.data;
//               demoApp.activeParty = party;
//               demoApp.fetchAssets();
//               demoApp.fetchAuctions();
//               toastr.success('Switched to '+ party);
//           }else{
//               toastr.error(response.data? response.data.message: "Something went wrong. Please try again later!");
//           }
//        });
//    }
//
//
//    demoApp.fetchAuctions = () => {
//       demoApp.showAuctionSpinner = true;
//       $http.get(apiBaseURL + 'list')
//       .then((response) => {
//          if(response.data && response.data.status){
//             demoApp.auctions = response.data.data;
//          }else{
//             toastr.error(response.data? response.data.message: "Something went wrong. Please try again later!");
//          }
//          demoApp.showAuctionSpinner = false;
//       });
//    }
//
//    demoApp.fetchAssets = () => {
//        demoApp.showAssetSpinner = true;
//       $http.get(apiBaseURL + 'asset/list')
//       .then((response) => {
//          if(response.data && response.data.status){
//                demoApp.assets = [];
//                for(let i in response.data.data){
//                    if(response.data.data[i].state.data.owner.includes(demoApp.activeParty)){
//                        demoApp.assets.push(response.data.data[i]);
//                    }
//                    demoApp.assetMap[response.data.data[i].state.data.linearId.id] = response.data.data[i]
//                }
//          }else{
//             toastr.error(response.data? response.data.message: "Something went wrong. Please try again later!");
//          }
//          demoApp.showAssetSpinner = false;
//       });
//    }
//
//    demoApp.openAuctionModal = (auction) => {
//        const auctionModal = $uibModal.open({
//            templateUrl: 'auctionModal.html',
//            controller: 'AuctionModalCtrl',
//            controllerAs: 'auctionModalCtrl',
//            windowClass: 'app-modal-window',
//            resolve: {
//                demoApp: () => demoApp,
//                apiBaseURL: () => apiBaseURL,
//                toastr: () => toastr,
//                auction: () => auction,
//                asset: () => demoApp.assetMap[auction.state.data.auctionItem.pointer.id],
//                activeParty: () => demoApp.activeParty
//            }
//        });
//
//        auctionModal.result.then(() => {}, () => {});
//    };
//
//
//    demoApp.openAssetModal = (assetId) => {
//        const assetModal = $uibModal.open({
//            templateUrl: 'assetModal.html',
//            controller: 'AssetModalCtrl',
//            controllerAs: 'assetModalCtrl',
//            windowClass: 'app-modal-window',
//            resolve: {
//                demoApp: () => demoApp,
//                apiBaseURL: () => apiBaseURL,
//                toastr: () => toastr,
//                asset: () => demoApp.assetMap[assetId.id]
//            }
//        });
//
//        assetModal.result.then(() => {}, () => {});
//    };
//
//    demoApp.openIssueCashModal = (assetId) => {
//        const cashModal = $uibModal.open({
//            templateUrl: 'issueCashModal.html',
//            controller: 'CashModalCtrl',
//            controllerAs: 'cashModalCtrl',
//            resolve: {
//                demoApp: () => demoApp,
//                apiBaseURL: () => apiBaseURL,
//                toastr: () => toastr,
//            }
//        });
//
//        cashModal.result.then(() => {}, () => {});
//    };

});


app.controller('CreateAccountModalCtrl', function ($http, $uibModalInstance, $uibModal, demoApp, apiBaseURL, toastr) {
    const createAccountModel = this;

    createAccountModel.form = {};

    createAccountModel.create = () => {
        if(createAccountModel.form.name == undefined || createAccountModel.form.name == '' ){
           toastr.error("Enter Gamer Account Name!");
        }else{
           demoApp.showSpinner = true;
           $http.get(apiBaseURL + 'account/create/' + createAccountModel.form.name)
           .then((response) => {
              if(response.data && response.data.status){
                  toastr.success('Gamer Account Create Successfully');
                  //demoApp.fetchAssets();
                  $uibModalInstance.dismiss();
              }else{
                  toastr.error(response.data? response.data.message: "Something went wrong. Please try again later!");
              }
              demoApp.showSpinner = false;
           });
        }
    }

    createAccountModel.cancel = () => $uibModalInstance.dismiss();

});

//app.controller('CashModalCtrl', function ($http, $uibModalInstance, $uibModal, demoApp, apiBaseURL, toastr) {
//    const cashModalModel = this;
//
//    cashModalModel.form = {};
//    cashModalModel.form.party = "PartyA";
//    cashModalModel.issueCash = () => {
//        if(cashModalModel.form.amount == undefined){
//           toastr.error("Please enter amount to be issued");
//        }else{
//            demoApp.showSpinner = true;
//            $http.post(apiBaseURL + 'issueCash', cashModalModel.form)
//            .then((response) => {
//               if(response.data && response.data.status){
//                   toastr.success('Cash Issued Successfully');
//                   demoApp.fetchBalance();
//                   $uibModalInstance.dismiss();
//               }else{
//                   toastr.error(response.data? response.data.message: "Something went wrong. Please try again later!");
//               }
//               demoApp.showSpinner = false;
//            });
//        }
//    }
//
//    cashModalModel.cancel = () => $uibModalInstance.dismiss();
//
//});
//
//app.controller('AuctionModalCtrl', function ($http, $uibModalInstance, $uibModal, $interval, demoApp, apiBaseURL, toastr, auction, asset, activeParty) {
//    const auctionModalModel = this;
//
//    auctionModalModel.asset = asset;
//    auctionModalModel.auction = auction;
//    auctionModalModel.timer = {};
//    auctionModalModel.activeParty = activeParty;
//    let deadline = new Date(auctionModalModel.auction.state.data.bidEndTime).getTime();
//    auctionModalModel.bidForm = {};
//
//    auctionModalModel.bidForm = {};
//
//    auctionModalModel.cancel = () => $uibModalInstance.dismiss();
//
//    auctionModalModel.placeBid = (auctionId) => {
//        auctionModalModel.bidForm.auctionId = auctionId;
//        if(auctionModalModel.auction.state.data.auctioneer.includes(auctionModalModel.activeParty)){
//           toastr.error("Can't Bid on your own Auction");
//           return;
//        }
//        if(auctionModalModel.bidForm.amount == undefined || auctionModalModel.bidForm.amount == ''){
//           toastr.error("Please enter Bid Amount");
//           return;
//        }
//        demoApp.showSpinner = true;
//        $http.post(apiBaseURL + 'placeBid', auctionModalModel.bidForm)
//       .then((response) => {
//           if(response.data && response.data.status){
//               toastr.success('Bid Placed Successfully');
//               $uibModalInstance.dismiss();
//               demoApp.fetchAuctions();
//           }else{
//               toastr.error(response.data? response.data.message: "Something went wrong. Please try again later!");
//           }
//           demoApp.showSpinner = false;
//       });
//    }
//
//    auctionModalModel.payAndSettle = () => {
//       auctionModalModel.settlementForm = {}
//       auctionModalModel.settlementForm.auctionId = auctionModalModel.auction.state.data.auctionId;
//       auctionModalModel.settlementForm.amount = auctionModalModel.auction.state.data.highestBid;
//       demoApp.showSpinner = true;
//       $http.post(apiBaseURL + 'payAndSettle', auctionModalModel.settlementForm)
//       .then((response) => {
//           if(response.data && response.data.status){
//               toastr.success('Auction Settled Successfully');
//               $uibModalInstance.dismiss();
//               demoApp.fetchAuctions();
//               demoApp.fetchAssets();
//               demoApp.fetchBalance();
//           }else{
//               toastr.error(response.data? response.data.message: "Something went wrong. Please try again later!");
//           }
//           demoApp.showSpinner = false;
//       });
//    }
//
//    auctionModalModel.exit = () => {
//        demoApp.showSpinner = true;
//        $http.post(apiBaseURL + 'delete' + '/' + auctionModalModel.auction.state.data.auctionId)
//        .then((response) => {
//            if(response.data && response.data.status){
//                toastr.success('Auction Deleted Successfully');
//                $uibModalInstance.dismiss();
//                demoApp.fetchAuctions();
//            }else{
//                toastr.error(response.data? response.data.message: "Something went wrong. Please try again later!");
//            }
//            demoApp.showSpinner = false;
//        });
//    }
//
//
//      var x = $interval(function() {
//            let now = new Date().getTime();
//            let distance =  deadline - now;
//
//            auctionModalModel.timer.days = Math.floor(distance / (1000 * 60 * 60 * 24));
//            auctionModalModel.timer.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//            auctionModalModel.timer.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//            auctionModalModel.timer.seconds = Math.floor((distance % (1000 * 60)) / 1000);
//
//            if(distance < 0){
//                $interval.cancel();
//                auctionModalModel.timer.days = 0;
//                auctionModalModel.timer.hours = 0;
//                auctionModalModel.timer.minutes = 0;
//                auctionModalModel.timer.seconds = 0;
//                auctionModalModel.auction.state.data.active = false;
//                $interval.cancel(x);
//                demoApp.fetchAuctions();
//            }
//        }, 1000);
//});
//
//app.controller('AssetModalCtrl', function ($http, $uibModalInstance, $uibModal, demoApp, apiBaseURL, toastr, asset) {
//    const assetModalModel = this;
//
//    assetModalModel.asset = asset;
//
//    assetModalModel.createAuctionForm = {};
//
//    assetModalModel.cancel = () => $uibModalInstance.dismiss();
//
//    assetModalModel.createAuction = (assetId) => {
//        assetModalModel.createAuctionForm.assetId = assetId.id;
//        assetModalModel.createAuctionForm.deadline = $("#datetimepicker > input").val();
//
//        if(assetModalModel.createAuctionForm.basePrice == undefined ||
//            assetModalModel.createAuctionForm.deadline == undefined ||
//            assetModalModel.createAuctionForm.deadline == "" ||
//            assetModalModel.createAuctionForm.basePrice == ""){
//            toastr.error("Base Price and Auction Deadline are mandatory");
//        }else{
//            demoApp.showSpinner = true;
//            $http.post(apiBaseURL + 'create', assetModalModel.createAuctionForm)
//            .then((response) => {
//               if(response.data && response.data.status){
//                    $uibModalInstance.dismiss();
//                    demoApp.fetchAuctions();
//                    toastr.success('Asset placed in auction successfully.');
//               }else{
//                   toastr.error(response.data? response.data.message: "Something went wrong. Please try again later!");
//               }
//               demoApp.showSpinner = false;
//            });
//        }
//    }
//});
