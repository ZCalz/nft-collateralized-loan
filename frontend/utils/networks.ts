import SepoliaAddresses from '../../deployed_addresses/sepolia.json';
import DevelopmentAddresses from '../../deployed_addresses/development.json'
import LineaSepoliaAddresses from '../../deployed_addresses/lineaSepolia.json'

export type NetworkDeployedAddress = {
    Nft: string
    LoanToken: string
    NFTCollateralLoanIssuer: string
}
export type ActiveNetworks = {
    SEPOLIA: NetworkDeployedAddress,
    LINEA_SEPOLIA: NetworkDeployedAddress,
    DEVELOPMENT: NetworkDeployedAddress
}

export const NetworkMap: ActiveNetworks = {
    SEPOLIA: SepoliaAddresses,
    LINEA_SEPOLIA: LineaSepoliaAddresses,
    DEVELOPMENT: DevelopmentAddresses
}