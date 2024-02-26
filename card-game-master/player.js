var Player = function() {

    this.name = "";
    this.isHuman = false;
    this.skillLevel = "";
    this.playerPosition = "";
    this.playerPositionInt = 0;
    this.cards = [];
    this.currentRoundTricksTaken = 0;
    this.gameScore = 0;
    this.isShownVoidInSuit = [false, false, false, false];

    this.Initialize = function(aName, aIsHuman, aSkill, aPosition) {
        this.name = aName;
        this.isHuman = aIsHuman;
        this.skillLevel = aSkill;
        this.currentRoundTricksTaken = 0;
        this.gameScore = 0;
        this.playerPosition = aPosition;
        switch (this.playerPosition) {
            case 'South':
                this.playerPositionInt = 0;
                break;
            case 'West':
                this.playerPositionInt = 1;
                break;
            case 'North':
                this.playerPositionInt = 2;
                break;
            default:
                this.playerPositionInt = 3;
                break;
        }
    }

    this.ChoosePlayCard = function() {
        if (this.isHuman) {
            game.PromptPlayerToPlayCard();
        } else {
            var card = this.FindBestPlayingCard(game, false);
            game.OnPlayerChosePlayCard(card);
        }
    }

    this.FindBestPlayingCard = function(aGame) {
        var possiblePlays = aGame.GetLegalCardsForCurrentPlayerTurn();
        switch (this.skillLevel) {
            case 'Easy':
                return possiblePlays[0];
            case 'Standard':
                return this.FindStandardPlayingCard(aGame, possiblePlays);
            default:
                return FindOptimalPlayForCurrentPlayer(aGame);
        }
    }

    this.FindStandardPlayingCard = function(aGame, possiblePlays) {
        // Try not to take the trick
        if (game.trickCards.length == 0) {
            // Lead with the lowest card value possible
            var play = possiblePlays[0];
            for (var i=1; i<possiblePlays.length; i++) {
                var possiblePlay = possiblePlays[i];
                if (possiblePlay.value < play.value) {
                    play = possiblePlay;
                }
            }
            return play;
        } else {
            var leadCard = aGame.trickCards[0];
            var play = possiblePlays[0];
            if (play.suit === leadCard.suit) {
                // Must play the same suit
                possiblePlays.sort(function(a,b) { 
                    return a.value - b.value;
                });

                var highestCardInTrick = leadCard;
                for (var i=1; i<aGame.trickCards.length; i++) {
                    var playedCard = aGame.trickCards[i];
                    if ((playedCard.suit === leadCard.suit && playedCard.value > highestCardInTrick.value) ||
                        (playedCard.suit == 'S' && highestCardInTrick.suit != 'S')) {
                        highestCardInTrick = playedCard;
                    }
                }

                if (game.trickCards.length < 3) {
                // Play the highest card that will not take the hand
                var curPlay = possiblePlays[0];
                if (curPlay.value > highestCardInTrick.value) {
                    // We will have to play our lowest card and hope the next person has higher
                    return curPlay;
                } else {
                    // Play the highest value that is less than the current highest card in the trick
                    for (var i = 1; i < possiblePlays.length; i++) {
                        var possibleCard = possiblePlays[i];
                        if (possibleCard.value < highestCardInTrick.value) {
                            curPlay = possibleCard;
                        }
                    }
                    return curPlay;
                }
                } else {
                    // Try to not take the trick but if we must, then play the highest card
                    var curPlay = possiblePlays[0];
                    if (curPlay.value > highestCardInTrick.value) {
                        // play our highest card
                        var highestCard = possiblePlays[possiblePlays.length - 1];
                        return highestCard;
                    } else {
                        // Play the highest value that is less than the current highest card in the trick
                        for (var i = 1; i < possiblePlays.length; i++) {
                            var possibleCard = possiblePlays[i];
                            if (possibleCard.value < highestCardInTrick.value) {
                                curPlay = possibleCard;
                            }
                        }
                    return curPlay;
                    }
                }
            } else {
                // Play the highest valued card we have that is not a trump spade
                possiblePlays.sort(function(a,b) { 
                    if (a.suit == 'S' && b.suit != 'S') {
                        return 1;
                    } else if (b.suit == 'S' && a.suit != 'S') {
                        return -1;
                    } else {
                        return b.value - a.value;
                    }
                });
                return possiblePlays[0];
            }
        }
    }
}