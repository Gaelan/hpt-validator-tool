import React from "react"
import {
  Header,
  NavMenuButton,
  Title,
  PrimaryNav,
} from "@trussworks/react-uswds"
import { useState } from "react"

const HptHeader = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const toggleMobileNav = () => {
    setMobileNavOpen((prevOpen) => !prevOpen)
  }

  const navItems = [
    <a
      key="primaryNav_1"
      className="usa-nav__link"
      href={import.meta.env.BASE_URL}
    >
      Machine readable file
    </a>,
    <a
      key="primaryNav_2"
      className="usa-nav__link"
      href={`${import.meta.env.BASE_URL}filename-wizard/`}
    >
      File name wizard
    </a>,
  ]

  return (
    <>
      <a className="usa-skipnav" href="#main-content">
        Skip to main content
      </a>
      {/* <GovBanner/> */}
      <Header basic={true}>
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <Title>
              <a href={import.meta.env.BASE_URL}>
                Hospital Price Transparency Tools
              </a>
            </Title>

            <NavMenuButton
              label="Menu"
              onClick={toggleMobileNav}
            ></NavMenuButton>
          </div>
          <PrimaryNav
            items={navItems}
            mobileExpanded={mobileNavOpen}
            onToggleMobileNav={toggleMobileNav}
          />
        </div>
      </Header>
    </>
  )
}

export default HptHeader
