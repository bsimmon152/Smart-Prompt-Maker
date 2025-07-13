import requests
import sys
from datetime import datetime
import json
import uuid

class BackendAPITester:
    def __init__(self, base_url="https://25734e68-224a-4b30-b183-180ba158cfdb.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_category_id = None
        self.created_use_case_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {json.dumps(response_data, indent=2)[:500]}...")
                except:
                    print(f"Response: {response.text[:500]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "api/", 200)

    def test_create_status_check(self):
        """Test creating a status check"""
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        return self.run_test("Create Status Check", "POST", "api/status", 200, test_data)

    def test_get_status_checks(self):
        """Test getting all status checks"""
        return self.run_test("Get Status Checks", "GET", "api/status", 200)

    def test_initialize_data(self):
        """Test initializing default data"""
        return self.run_test("Initialize Default Data", "POST", "api/admin/initialize-data", 200)

    def test_get_admin_categories(self):
        """Test getting all categories (admin endpoint)"""
        return self.run_test("Get Admin Categories", "GET", "api/admin/categories", 200)

    def test_get_public_categories(self):
        """Test getting all categories (public endpoint)"""
        return self.run_test("Get Public Categories", "GET", "api/categories", 200)

    def test_create_category(self):
        """Test creating a new category"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_data = {
            "name": f"Test Category {timestamp}",
            "icon": "Target",
            "color": "bg-purple-500",
            "example": f"This is a test category created at {timestamp}"
        }
        success, response = self.run_test("Create Category", "POST", "api/admin/categories", 200, test_data)
        if success and isinstance(response, dict) and 'id' in response:
            self.created_category_id = response['id']
            print(f"Created category ID: {self.created_category_id}")
        return success, response

    def test_update_category(self):
        """Test updating an existing category"""
        if not self.created_category_id:
            print("❌ Skipping update test - no category ID available")
            return False, {}
        
        test_data = {
            "name": "Updated Test Category",
            "example": "This category has been updated"
        }
        return self.run_test("Update Category", "PUT", f"api/admin/categories/{self.created_category_id}", 200, test_data)

    def test_create_use_case(self):
        """Test creating a new use case"""
        if not self.created_category_id:
            print("❌ Skipping use case creation - no category ID available")
            return False, {}
        
        timestamp = datetime.now().strftime('%H%M%S')
        test_data = {
            "name": f"Test Use Case {timestamp}",
            "template": "Create a test prompt for {businessName} in the {industry} industry targeting {targetAudience}.",
            "example": f"This is a test use case created at {timestamp}"
        }
        success, response = self.run_test("Create Use Case", "POST", f"api/admin/categories/{self.created_category_id}/use-cases", 200, test_data)
        if success and isinstance(response, dict) and 'id' in response:
            self.created_use_case_id = response['id']
            print(f"Created use case ID: {self.created_use_case_id}")
        return success, response

    def test_update_use_case(self):
        """Test updating an existing use case"""
        if not self.created_use_case_id:
            print("❌ Skipping use case update - no use case ID available")
            return False, {}
        
        test_data = {
            "name": "Updated Test Use Case",
            "template": "Updated template for {businessName} in {industry}",
            "example": "This use case has been updated"
        }
        return self.run_test("Update Use Case", "PUT", f"api/admin/use-cases/{self.created_use_case_id}", 200, test_data)

    def test_delete_use_case(self):
        """Test deleting a use case"""
        if not self.created_use_case_id:
            print("❌ Skipping use case deletion - no use case ID available")
            return False, {}
        
        return self.run_test("Delete Use Case", "DELETE", f"api/admin/use-cases/{self.created_use_case_id}", 200)

    def test_delete_category(self):
        """Test deleting a category"""
        if not self.created_category_id:
            print("❌ Skipping category deletion - no category ID available")
            return False, {}
        
        return self.run_test("Delete Category", "DELETE", f"api/admin/categories/{self.created_category_id}", 200)

def main():
    print("🚀 Starting Backend API Tests...")
    print("=" * 50)
    
    # Setup
    tester = BackendAPITester()
    
    # Test all endpoints
    tester.test_root_endpoint()
    tester.test_create_status_check()
    tester.test_get_status_checks()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend tests passed!")
        return 0
    else:
        print("⚠️  Some backend tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())