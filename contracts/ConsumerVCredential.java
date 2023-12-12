


// Define the main class for the chaincode
public class VerifiableCredential {

    // this is to handle the JSON serialization
    private final Genson genson = new Genson();


    // Define a nested class to represent the data model of the Verifiable Credential
    // this needs to match w3 standards 
    @DataType
    public static class Credential {

        // Declare a property for the Credential's ID (this should be DID)
        // Should check if this id is DID?
        @Property()
        private String id;

        // to store VC json data
        @Property()
        private String jsonCredential;

        // Get method for the hide did
        public String getId() { return id; }
        
        // // Set method for the hide did
        // public void setId(String id) { this.id = id; }

        
        // Get method for the JSON credential data
        public String getJsonCredential() { return jsonCredential; }
        
        // Set method for the JSON credential data
        public void setJsonCredential(String jsonCredential) { this.jsonCredential = jsonCredential; }
    }

    // Define a method to mint a new Verifiable Credential
    // should owner of credential be sent directly here (as parameter)?
    // ownership - probably should pass this into function
    public String mintCredential(Context ctx, String id, String jsonCredential) {
        // to interact with ledger
        ChaincodeStub stub = ctx.getStub();

        Credential credential = new Credential();

        // right here, need to ensure that the credential follows DID standard
        // check jsonCredential is w3
        
        // Set the ID for the Credential
        // check if this is a hide did...
        // string splice to check format - check if role is patient
        credential.setId(id);
        
        // Set the JSON data for the Credential
        credential.setJsonCredential(jsonCredential);

        // Serialize the Credential object to a JSON string - needs to be w3 standard
        String credentialJSON = genson.serialize(credential);
        
        // Store the serialized Credential on the ledger using its ID as the key
        // need to ensure credentialJSON is w3 standard
        stub.putStringState(id, credentialJSON);

        // Return the ID of the minted Credential
        return id;
    }

    // Define a method to retrieve a Verifiable Credential from the ledger using its ID
    public String getCredential(Context ctx, String id) {
        // Get the chaincode stub to interact with the ledger
        ChaincodeStub stub = ctx.getStub();
        
        // Retrieve the serialized Credential from the ledger using its ID
        String credentialJSON = stub.getStringState(id);

        // Check if the retrieved Credential is null or empty
        if (credentialJSON == null || credentialJSON.isEmpty()) {
            // If null or empty, return null
            return null;
        }

        // If not null, return the serialized Credential
        return credentialJSON;
    }
}
