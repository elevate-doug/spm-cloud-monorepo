const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
      <p className="mb-4 text-center text-xs text-gray-600 sm:!mb-0">
        ©{new Date().getFullYear()} STERIS. All Rights Reserved.
      </p>
      <div>
        <ul className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10">
          <li>
            <a
              target="blank"
              href="mailto:support@spm.com"
              className="text-xs font-medium text-gray-600 hover:text-gray-800"
            >
              Support
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="#"
              className="text-xs font-medium text-gray-600 hover:text-gray-800"
            >
              License
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="#"
              className="text-xs font-medium text-gray-600 hover:text-gray-800"
            >
              Terms of Use
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
