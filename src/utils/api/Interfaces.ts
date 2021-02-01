export interface IGuildMember{
  uuid: string,
  rank: string,
  joined: number,
  questParticipation: number,
  expHistory: Record<string, number>
}

export interface IPlayer {
  displayname: string,
  uuid: string,
  lastLogin: number,
  lastLogout: number
}