import Sepolia from '../../deployed_addresses/sepolia.json';
import Development from '../../deployed_addresses/development.json'
import LineaSepolia from '../../deployed_addresses/lineaSepolia.json'

type NetworkDeployedAddress = {
    Nft: string
    LoanToken: string
    NFTCollateralLoanIssuer: string
}
type ActiveNetworks = {
    SEPOLIA: NetworkDeployedAddress,
    LINEA_SEPOLIA: NetworkDeployedAddress,
    DEVELOPMENT: NetworkDeployedAddress
}

export const NetworkMap: ActiveNetworks = {
    SEPOLIA: Sepolia,
    LINEA_SEPOLIA: Development,
    DEVELOPMENT: LineaSepolia
}