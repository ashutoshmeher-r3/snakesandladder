package net.corda.samples.client;

import net.corda.core.contracts.StateAndRef;
import net.corda.core.messaging.CordaRPCOps;
import net.corda.core.node.services.Vault;
import net.corda.core.node.services.vault.QueryCriteria;
import net.corda.sample.snl.states.GameBoard;
import net.corda.samples.snl.flows.CreateAndShareAccountFlow;
import net.corda.samples.snl.flows.PlayerMoveFlow;
import net.corda.samples.snl.flows.StartGameFlow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/snl/")
public class Controller {

    @Autowired
    private CordaRPCOps rpcProxy;

    @PostMapping("createGame")
    public APIResponse<String> createGame(@RequestBody Forms.CreateGameForm createGameForm) {
       try{
            String gameId = rpcProxy.startFlowDynamic(StartGameFlow.class, createGameForm.getPlayer1(),
                    createGameForm.getPlayer2()).getReturnValue().get();
            return APIResponse.success(gameId);
        }catch(Exception e){
            return APIResponse.error(e.getMessage());
        }
    }

    @PostMapping("playerMove")
    public APIResponse<Void> createGame(@RequestBody Forms.PlayerMoveForm playerMoveForm) {
        try{
            rpcProxy.startFlowDynamic(PlayerMoveFlow.Initiator.class, playerMoveForm.getPlayer(),
                    playerMoveForm.getUniqueId(), playerMoveForm.getDiceRolled()).getReturnValue().get();
            return APIResponse.success();
        }catch(Exception e){
            return APIResponse.error(e.getMessage());
        }
    }

    @GetMapping("account/create/{name}")
    public APIResponse<Void> createAccount(@PathVariable String name){
        try{
            rpcProxy.startFlowDynamic(CreateAndShareAccountFlow.class, name).getReturnValue().get();
            return APIResponse.success();
        }catch(Exception e){
            return APIResponse.error(e.getMessage());
        }
    }


    @GetMapping("getGame/{gameId}")
    public APIResponse<GameBoard> getGame(@PathVariable String gameId){
        try{

            GameBoard gameBoard = rpcProxy.vaultQueryByCriteria(
                            new QueryCriteria.LinearStateQueryCriteria(null,
                                    Collections.singletonList(UUID.fromString(gameId)),
                                    null, Vault.StateStatus.UNCONSUMED, null),
                            GameBoard.class
                    ).getStates().get(0).getState().getData();
            return APIResponse.success(gameBoard);
        }catch(Exception e){
            return APIResponse.error(e.getMessage());
        }
    }

//
//    @PostMapping("asset/create")
//    public APIResponse<Void> createAsset(@RequestBody Forms.AssetForm assetForm){
//        try{
//            activeParty.startFlowDynamic(CreateAssetFlow.class, assetForm.getTitle(), assetForm.getDescription(),
//                    assetForm.getImageUrl()).getReturnValue().get();
//            return APIResponse.success();
//        }catch(Exception e){
//            return APIResponse.error(e.getMessage());
//        }
//    }
//
//    @PostMapping("create")
//    public APIResponse<Void> createAuction(@RequestBody Forms.CreateAuctionForm auctionForm){
//        try {
//            activeParty.startFlowDynamic(CreateAuctionFlow.Initiator.class,
//                    Amount.parseCurrency(auctionForm.getBasePrice() + " USD"),
//                    UUID.fromString(auctionForm.getAssetId()),
//                    LocalDateTime.parse(auctionForm.getDeadline(),
//                            DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss a"))).getReturnValue().get();
//            return APIResponse.success();
//        }catch (ExecutionException e){
//            if(e.getCause() != null && e.getCause().getClass().equals(TransactionVerificationException.ContractRejection.class)){
//                return APIResponse.error(e.getCause().getMessage());
//            }else{
//                return APIResponse.error(e.getMessage());
//            }
//        }catch (Exception e){
//            return APIResponse.error(e.getMessage());
//        }
//    }
//
//    @PostMapping("delete/{auctionId}")
//    public APIResponse<Void> deleteAuction(@PathVariable String auctionId){
//        try {
//            activeParty.startFlowDynamic(AuctionExitFlow.Initiator.class, UUID.fromString(auctionId)).getReturnValue().get();
//            return APIResponse.success();
//        }catch (ExecutionException e){
//            if(e.getCause() != null && e.getCause().getClass().equals(TransactionVerificationException.ContractRejection.class)){
//                return APIResponse.error(e.getCause().getMessage());
//            }else{
//                return APIResponse.error(e.getMessage());
//            }
//        }catch (Exception e){
//            return APIResponse.error(e.getMessage());
//        }
//    }
//
//    @PostMapping("placeBid")
//    public APIResponse<Void> placeBid(@RequestBody Forms.BidForm bidForm){
//        try{
//            activeParty.startFlowDynamic(BidFlow.Initiator.class,
//                    Amount.parseCurrency(bidForm.getAmount() + " USD"),
//                    UUID.fromString(bidForm.getAuctionId()))
//                    .getReturnValue().get();
//            return APIResponse.success();
//        }catch (ExecutionException e){
//            if(e.getCause() != null && e.getCause().getClass().equals(TransactionVerificationException.ContractRejection.class)){
//                return APIResponse.error(e.getCause().getMessage());
//            }else{
//                return APIResponse.error(e.getMessage());
//            }
//        }catch (Exception e){
//            return APIResponse.error(e.getMessage());
//        }
//    }
//
//    @PostMapping("payAndSettle")
//    public APIResponse<Void> payAndSettle(@RequestBody Forms.SettlementForm settlementForm){
//        try {
//            activeParty.startFlowDynamic(AuctionSettlementFlow.class,
//                    UUID.fromString(settlementForm.getAuctionId()),
//                    Amount.parseCurrency(settlementForm.getAmount()))
//                    .getReturnValue().get();
//            return APIResponse.success();
//        }
//        catch (ExecutionException e){
//            if(e.getCause() != null && e.getCause().getClass().equals(TransactionVerificationException.ContractRejection.class)){
//                return APIResponse.error(e.getCause().getMessage());
//            }else{
//                return APIResponse.error(e.getMessage());
//            }
//        }catch (Exception e){
//            return APIResponse.error(e.getMessage());
//        }
//    }
//
//    @PostMapping("issueCash")
//    public APIResponse<Void> issueCash(@RequestBody Forms.IssueCashForm issueCashForm){
//        try{
//            activeParty.startFlowDynamic(CashIssueAndPaymentFlow.class,
//                    Amount.parseCurrency(issueCashForm.getAmount() + " USD"),
//                    OpaqueBytes.of("PartyA".getBytes()),
//                    activeParty.partiesFromName(issueCashForm.getParty(), false).iterator().next(),
//                    false,
//                    activeParty.notaryIdentities().get(0))
//                    .getReturnValue().get();
//            return APIResponse.success();
//        }catch (ExecutionException e){
//            if(e.getCause() != null && e.getCause().getClass().equals(TransactionVerificationException.ContractRejection.class)){
//                return APIResponse.error(e.getCause().getMessage());
//            }else{
//                return APIResponse.error(e.getMessage());
//            }
//        }catch (Exception e){
//            return APIResponse.error(e.getMessage());
//        }
//    }
//
//    @GetMapping("getCashBalance")
//    public APIResponse<Long> getCashBalance(){
//        try {
//            List<StateAndRef<Cash.State>> cashStateList = activeParty.vaultQuery(Cash.State.class).getStates();
//            Long amount = 0L;
//            if(cashStateList.size()>0) {
//                amount = cashStateList.stream().map(stateStateAndRef ->
//                        stateStateAndRef.getState().getData().getAmount().getQuantity()).reduce(Long::sum).get();
//                if (amount >= 100) {
//                    amount = amount / 100;
//                } else {
//                    amount = 0L;
//                }
//            }
//            return APIResponse.success(amount);
//        }catch (Exception e){
//            return APIResponse.error(e.getMessage());
//        }
//    }
//
//    @PostMapping(value = "switch-party/{party}")
//    public APIResponse<Long> switchParty(@PathVariable String party){
//        if(party.equals("PartyA")){
//            activeParty = partyAProxy;
//        }else if(party.equals("PartyB")){
//            activeParty = partyBProxy;
//        }else if(party.equals("PartyC")){
//            activeParty = partyCProxy;
//        }else{
//            return APIResponse.error("Unrecognised Party");
//        }
//        return getCashBalance();
//    }
//
//    /**
//     * Create some initial data to play with.
//     * @return
//     */
//    @PostMapping("setup")
//    public APIResponse<Void> setupDemoData(){
//        try {
//            partyAProxy.startFlowDynamic(CreateAssetFlow.class,
//                    "Mona Lisa",
//                    "The most famous painting in the world, a masterpiece by Leonardo da Vinci, the mysterious woman with " +
//                            "the enigmatic smile. The sitter in the painting is thought to be Lisa Gherardini, the wife of " +
//                            "Florence merchant Francesco del Giocondo. It did represent an innovation in art -- the painting" +
//                            " is the earliest known Italian portrait to focus so closely on the sitter in a half-length " +
//                            "portrait.",
//                    "img/Mona_Lisa.jpg");
//
//            partyAProxy.startFlowDynamic(CreateAssetFlow.class,
//                    "The Last Supper",
//                    "Yet another masterpiece by Leonardo da Vinci, painted in an era when religious imagery was still " +
//                            "a dominant artistic theme, \"The Last Supper\" depicts the last time Jesus broke bread with " +
//                            "his disciples before his crucifixion.",
//                    "img/The_Last_Supper.jpg");
//
//
//            partyBProxy.startFlowDynamic(CreateAssetFlow.class,
//                    "The Starry Night",
//                    "Painted by Vincent van Gogh, this comparatively abstract painting is the signature example of " +
//                            "van Gogh's innovative and bold use of thick brushstrokes. The painting's striking blues and " +
//                            "yellows and the dreamy, swirling atmosphere have intrigued art lovers for decades.",
//                    "img/The_Scary_Night.jpg");
//
//            partyCProxy.startFlowDynamic(CreateAssetFlow.class,
//                    "The Scream",
//                    "First things first -- \"The Scream\" is not a single work of art. According to a British Museum's blog," +
//                            " there are two paintings, two pastels and then an unspecified number of prints. Date back to " +
//                            "the the year 1893, this masterpiece is a work of Edvard Munch",
//                    "img/The_Scream.jpg");
//
//            activeParty = partyAProxy;
//        }catch (Exception e){
//            return APIResponse.error(e.getMessage());
//        }
//        return APIResponse.success();
//    }
}
