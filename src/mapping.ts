import { BigDecimal } from '@graphprotocol/graph-ts'
import { Transfer } from '../generated/ERC20/ERC20'
import { User } from '../generated/schema'

let lpTokenAdress = '0x470BC451810B312BBb1256f96B0895D95eA659B1'

export function handleTransfer(event: Transfer): void {
  if (event.params.to.toHexString() !== lpTokenAdress) return

  let id = event.params.from.toHexString()
  let user = User.load(id)
  if (user == null) {
    user = new User(id)
    user.totalVolume = BigDecimal.fromString('0')
  }

  user.totalVolume = user.totalVolume.plus(event.params.value.toBigDecimal())

  user.save()
}
