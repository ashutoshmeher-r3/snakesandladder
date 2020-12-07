package net.corda.sample.snl.contracts;

import net.corda.core.contracts.CommandData;
import net.corda.core.contracts.Contract;
import net.corda.core.transactions.LedgerTransaction;
import org.jetbrains.annotations.NotNull;

public class GameBoardContract implements Contract {

    @Override
    public void verify(@NotNull LedgerTransaction tx) throws IllegalArgumentException {

    }

    public interface Commands extends CommandData {
        class Create implements Commands {}
        class PlayMove implements Commands {
            private int roll;

            public PlayMove(int roll) {
                this.roll = roll;
            }

            public int getRoll() {
                return roll;
            }
        }
    }
}
