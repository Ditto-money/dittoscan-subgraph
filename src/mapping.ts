import { BigDecimal, log } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/ERC20/ERC20";
import { Swap } from "../generated/Pair/Pair";
import { User } from "../generated/schema";

let lpTokenAdress = "0x470bc451810b312bbb1256f96b0895d95ea659b1";

export function handleTransfer(event: Transfer): void {
    if (event.params.to.toHexString() == lpTokenAdress) {
        let id = event.params.from.toHexString()
		
		let user = User.load(id)
        if (user == null) {
            user = new User(id)
            user.totalVolume = BigDecimal.fromString("0")
        }

        user.totalVolume = user.totalVolume.plus(
            event.params.value.toBigDecimal()
        )

        user.save()
    }
}

export function handleSwap(event: Swap): void {
    let id = event.params.to.toHexString()

    let user = User.load(id)
    if (user == null) {
        user = new User(id)
        user.totalVolume = BigDecimal.fromString("0")
    }

    user.totalVolume = user.totalVolume
        .plus(event.params.amount0In.toBigDecimal())
		.plus(event.params.amount0Out.toBigDecimal())
		
	user.save()
}
