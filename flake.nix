{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    ...
  }: let
    inherit (nixpkgs.lib) optional;
    systems = flake-utils.lib.system;
  in
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
      };

      defaultShellConf = {
        nativeBuildInputs = with pkgs;
          [
            nodejs
            rover
            k6
          ]
          ++ optional (system == systems.aarch64-darwin) [
            darwin.apple_sdk.frameworks.CoreFoundation
            darwin.apple_sdk.frameworks.CoreServices
            darwin.apple_sdk.frameworks.Security
            darwin.apple_sdk.frameworks.SystemConfiguration
          ];

        shellHook = ''
          project_root="$(git rev-parse --show-toplevel 2>/dev/null || jj workspace root 2>/dev/null)"
          export PATH="$project_root/node_modules/.bin:$PATH";
        '';
      };
    in {
      devShells.default = pkgs.mkShell defaultShellConf;
    });
}
