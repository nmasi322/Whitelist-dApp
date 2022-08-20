import React from 'react'
import Head from 'next/head'
import styles from "../styles/Home.module.css"
import Web3Modal from "web3modal"
import { providers, Contract } from 'ethers'
import { useEffect, useRef, useState } from 'react'
import {WHITELIST_CONTRACT_ADDRESS, abi} from "../constants/index"

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberWhitelisted, setNumberOfWhitelisted] = useState(0);
  const web3ModalRef = useRef();
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli!");
      throw new Error("Change network to Goerli!!");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(numberOfWhitelisted + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const addAddressToWhitelist = async () => {
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx = await whitelistContract.addToWhitelist();
      await tx.wait();
      await getNumberOfWhitelisted();
      setLoading(false);
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };


  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Adding you to the whitelist...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);
  return (
    <div>
      <Head>
        <title>Whitelist dApp by Divine</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
       <div>
          <h1 className={styles.title}>Welcome to JS Web3 Devs! 🚀</h1>
          <div className={styles.description}>
            Its an NFT collection for Javascript developers in Web3.
          </div>
          <div className={styles.description}>
            {numberWhitelisted} devs have already joined the whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="/crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by <a className='hover:underline text-blue-700 ml-1' href='https://twitter.com/divine_edeh1'> Divine Edeh</a>
      </footer>
    </div>
  )
}
