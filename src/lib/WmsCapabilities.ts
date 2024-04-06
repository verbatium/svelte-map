export interface WmsCapabilities {
  WMS_Capabilities: {
    Service: [{
      Name: string[]
      Title: string[]
      MaxWidth: string[]
      MaxHeight: string[]
    }]
    Capability: []
  };
}